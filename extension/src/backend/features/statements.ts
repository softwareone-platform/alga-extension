import { storage } from "../lib/alga/storage";
import { Statement } from "@/shared/statements";
import {
  Charge,
  ChargeListResponse,
  StatementListResponse,
  Statement as SWOStatement,
} from "@swo/mp-api-model/billing";
import { BillingConfig } from "@/shared/billing-configs";
import { billingConfigs } from "./billing-configs";
import { SWOClient } from "../lib/swo/client";
import { ListResponse } from "../lib/swo/api";

const STORAGE_NAMESPACE = "swo.statements";
const STORAGE_KEY = "all";
const STATEMENTS_LIMIT = 100;
const CHARGES_LIMIT = 100;

type InvoiceData = {
  invoiceId: string;
  markup: number;
};

// const toLine = (
//   charge: Charge,
//   billingConfig: BillingConfig
// ): ManualInvoiceLine | null => {
//   if (!charge.price?.unitSP) {
//     console.warn(`No price for charge ${charge.id}`);
//     return null;
//   }

//   const description = `${charge.item?.name || charge.description?.value1} (${
//     charge.id
//   })`;

//   const rate = Math.round(
//     charge.price.unitSP * (1 + billingConfig.markup / 100) * 100
//   );

//   return {
//     serviceId: billingConfig.serviceId,
//     quantity: charge.quantity ?? 0,
//     description,
//     rate,
//   } satisfies ManualInvoiceLine;
// };

const toStatement = (
  swoStatement: SWOStatement,
  invoiceData?: InvoiceData,
  billingConfig?: BillingConfig
): Statement => {
  if (!billingConfig) {
    return {
      ...swoStatement,
      alga: {
        status: "no-invoice",
      },
    };
  }

  if (!invoiceData) {
    return {
      ...swoStatement,
      alga: {
        status: "to-invoice",
      },
    };
  }

  return {
    ...swoStatement,
    alga: {
      status: "invoiced",
      invoiceId: invoiceData.invoiceId,
      markup: invoiceData.markup,
    },
  };
};

export class StatementService {
  private swoClient: SWOClient;

  constructor(swoClient: SWOClient) {
    this.swoClient = swoClient;
  }

  getById(id: string, rql: string): Statement {
    const statement = this.swoClient.fetch<SWOStatement>(
      `/billing/statements/${id}`,
      rql
    );

    const invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY
      ) ?? {};

    const bcs = billingConfigs.getConfigs();

    const billingConfig = bcs.find(
      (bc) => bc.agreementId === statement.agreement?.id
    );

    return toStatement(
      statement,
      invoicesData[statement.id ?? ""],
      billingConfig
    );
  }

  getByRQL(rql: string): ListResponse<Statement> {
    const { data: swoStatements, $meta } =
      this.swoClient.fetch<StatementListResponse>("/billing/statements", rql);

    if (!swoStatements || !$meta) {
      return { data: [], $meta: { pagination: { total: 0 } } };
    }

    const invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY
      ) ?? {};

    const bcs = billingConfigs.getConfigs();

    const billingConfigsByAgreementId = bcs.reduce((acc, config) => {
      acc[config.agreementId] = config;
      return acc;
    }, {} as Record<string, BillingConfig>);

    const statements = swoStatements.map((swoStatement) =>
      toStatement(
        swoStatement,
        invoicesData[swoStatement.id ?? ""],
        billingConfigsByAgreementId[swoStatement.agreement?.id ?? ""]
      )
    );

    return { data: statements, $meta };
  }

  invoiceStatement(statementId: string): Statement {
    const swoStatement = this.swoClient.fetch<SWOStatement>(
      `/billing/statements/${statementId}`,
      "select=id,agreement.id"
    );

    const billingConfig = billingConfigs
      .getConfigs()
      .find((bc) => bc.agreementId === swoStatement.agreement?.id);
    if (!billingConfig) {
      throw new Error(
        `Billing config not found for agreement ${swoStatement.agreement?.id}`
      );
    }

    let invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY
      ) ?? {};
    if (invoicesData[statementId]) {
      throw new Error(`Invoice already exists for statement ${statementId}`);
    }

    //TODO: Create invoice in Alga
    const charges = this.fetchAllCharges(swoStatement.id!);
    if (charges.length === 0) {
      throw new Error(`No charges found for statement ${statementId}`);
    }
    //     const lines = charges
    //       .map((charge) => toLine(charge, billingConfig))
    //       .filter((line) => !!line);
    //     console.log(lines);
    //     const manualInvoice = {} as ManualInvoice; // MOCKED
    invoicesData[statementId] = {
      invoiceId: "SOME_ID",
      markup: billingConfig.markup,
    };

    storage.put(STORAGE_NAMESPACE, STORAGE_KEY, invoicesData);

    return toStatement(swoStatement, invoicesData[statementId], billingConfig);
  }

  invoiceAll(): void {
    const bcs = billingConfigs.getConfigs();
    const billingConfigsByAgreementId = bcs.reduce((acc, config) => {
      acc[config.agreementId] = config;
      return acc;
    }, {} as Record<string, BillingConfig>);

    const invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY
      ) ?? {};

    let offset = 0;

    while (true) {
      const { data: swoStatements, $meta } =
        this.swoClient.fetch<StatementListResponse>(
          "/billing/statements",
          `[MAGIC!!!!!]&offset=${offset}&limit=${STATEMENTS_LIMIT}`
        );
      if (($meta?.pagination?.total ?? 0) <= offset) {
        break;
      }

      for (const swoStatement of swoStatements!) {
        const billingConfig =
          billingConfigsByAgreementId[swoStatement.agreement?.id ?? ""];
        if (!billingConfig) {
          continue;
        }

        const invoiceData = invoicesData[swoStatement.id!];
        if (invoiceData) {
          continue;
        }

        //TODO: Create invoice in Alga
        const charges = this.fetchAllCharges(swoStatement.id!);
        if (charges.length === 0) {
          continue;
        }
        // const lines = charges
        //   .map((charge) => toLine(charge, billingConfig))
        //   .filter((line) => !!line);
        // console.log(lines);
        // const manualInvoice = {} as ManualInvoice; // MOCKED
        invoicesData[swoStatement.id!] = {
          invoiceId: "SOME_ID",
          markup: billingConfig.markup,
        };
      }

      offset += STATEMENTS_LIMIT;
    }
  }

  private fetchAllCharges(statementId: string): Charge[] {
    let offset = 0;
    const charges: Charge[] = [];

    while (true) {
      const response = this.swoClient.fetch<ChargeListResponse>(
        `/billing/statements/${statementId}/charges`,
        `select=id,subscription.id,subscription.name,item.id,item.name,period.start,period.end,quantity,price.SPx1,price.unitSP&offset=${offset}&limit=${CHARGES_LIMIT}`
      );
      if (!response) {
        throw new Error(`Failed to fetch charges.`);
      }

      const { data, $meta } = response!;
      charges.push(...(data || []));

      offset += CHARGES_LIMIT;

      const total = $meta?.pagination?.total || 0;
      if (total <= offset) {
        break;
      }
    }

    return charges;
  }
}
