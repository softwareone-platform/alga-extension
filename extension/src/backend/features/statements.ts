import { storage } from "../lib/alga/storage";
import { Statement } from "@/shared/statements";
import {
  Charge,
  StatementListResponse,
  Statement as SWOStatement,
} from "@swo/mp-api-model/billing";
import { BillingConfig } from "@/shared/billing-configs";
import { billingConfigs } from "./billing-configs";
import { ManualInvoice, ManualInvoiceLine } from "../lib/alga";
import { StatementsClient } from "../lib/swo";
import { extension } from "./extension";
import { SWOClient } from "../lib/swo/client";
import { ListResponse } from "../lib/swo/api";
import { AgreementListResponse } from "@swo/mp-api-model/platform/models/AgreementListResponse";

const STORAGE_NAMESPACE = "swo.statements";
const STORAGE_KEY = "all";

type InvoiceData = {
  invoiceId: string;
  markup: number;
};

const toLine = (
  charge: Charge,
  billingConfig: BillingConfig,
): ManualInvoiceLine | null => {
  if (!charge.price?.unitSP) {
    console.warn(`No price for charge ${charge.id}`);
    return null;
  }

  const description = `${charge.item?.name || charge.description?.value1} (${
    charge.id
  })`;

  const rate = Math.round(
    charge.price.unitSP * (1 + billingConfig.markup / 100) * 100,
  );

  return {
    serviceId: billingConfig.serviceId,
    quantity: charge.quantity ?? 0,
    description,
    rate,
  } satisfies ManualInvoiceLine;
};

const toStatement = (
  swoStatement: SWOStatement,
  invoiceData?: InvoiceData,
  billingConfig?: BillingConfig,
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
      rql,
    );

    const invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY,
      ) ?? {};

    const bcs = billingConfigs.getConfigs();

    const billingConfig = bcs.find(
      (bc) => bc.agreementId === statement.agreement?.id,
    );

    return toStatement(
      statement,
      invoicesData[statement.id ?? ""],
      billingConfig,
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
        STORAGE_KEY,
      ) ?? {};

    const bcs = billingConfigs.getConfigs();

    const billingConfigsByAgreementId = bcs.reduce(
      (acc, config) => {
        acc[config.agreementId] = config;
        return acc;
      },
      {} as Record<string, BillingConfig>,
    );

    const statements = swoStatements.map((swoStatement) =>
      toStatement(
        swoStatement,
        invoicesData[swoStatement.id ?? ""],
        billingConfigsByAgreementId[swoStatement.agreement?.id ?? ""],
      ),
    );

    return { data: statements, $meta };
  }

  invoiceStatement(statementId: string): Statement {
    const swoStatement = this.swoClient.fetch<SWOStatement>(
      `/billing/statements/${statementId}`,
      "",
    );

    const billingConfig = billingConfigs
      .getConfigs()
      .find((bc) => bc.agreementId === swoStatement.agreement?.id);
    if (!billingConfig) {
      throw new Error(
        `Billing config not found for agreement ${swoStatement.agreement?.id}`,
      );
    }

    let invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY,
      ) ?? {};
    if (invoicesData[statementId]) {
      throw new Error(`Invoice already exists for statement ${statementId}`);
    }

    //TODO: Create invoice in Alga
    invoicesData[statementId] = {
      invoiceId: "SOME_ID",
      markup: billingConfig.markup,
    };

    storage.put(STORAGE_NAMESPACE, STORAGE_KEY, invoicesData);

    return toStatement(swoStatement, invoicesData[statementId], billingConfig);
  }

  invoiceAll(): void {
    const { data: swoStatements, $meta } =
      this.swoClient.fetch<StatementListResponse>("/billing/statements", "rql");

    const bcs = billingConfigs.getConfigs();
    const billingConfigsByAgreementId = bcs.reduce(
      (acc, config) => {
        acc[config.agreementId] = config;
        return acc;
      },
      {} as Record<string, BillingConfig>,
    );

    const invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY,
      ) ?? {};

    for (const swoStatement of swoStatements ?? []) {
      const billingConfig =
        billingConfigsByAgreementId[swoStatement.agreement?.id ?? ""];
      if (!billingConfig) {
        continue;
      }

      const invoiceData = invoicesData[swoStatement.id!];
      if (invoiceData) {
        continue;
      }
    }
  }

  // createInvoices(statements: SWOStatement[]) {
  //   const bcs = billingConfigs.getConfigs();
  //   const billingConfigsByAgreementId = bcs.reduce((acc, config) => {
  //     acc[config.agreementId] = config;
  //     return acc;
  //   }, {} as Record<string, BillingConfig>);

  //   const algaEntries =
  //     storage.get<Record<string, InvoiceData>>(
  //       STORAGE_NAMESPACE,
  //       STORAGE_KEY
  //     ) || {};

  //   for (const swoStatement of statements) {
  //     const billingConfig = swoStatement.agreement?.id
  //       ? billingConfigsByAgreementId[swoStatement.agreement.id]
  //       : null;

  //     if (
  //       !billingConfig ||
  //       !billingConfig.serviceId ||
  //       billingConfig.markup === undefined
  //     ) {
  //       // not billable
  //       continue;
  //     }

  //     const algaEntry = algaEntries[swoStatement.id!];
  //     if (!!algaEntry) {
  //       // already invoiced
  //       continue;
  //     }

  //     const { endpoint, token } = extension.getDetails();
  //     const swoClient = new SWOClient(endpoint, token);
  //     const statementsClient = new StatementsClient(swoClient);

  //     const charges = statementsClient.getCharges(swoStatement.id!);
  //     if (charges.length === 0) {
  //       // no charges
  //       continue;
  //     }

  //     const lines = charges
  //       .map((charge) => toLine(charge, billingConfig))
  //       .filter((line) => !!line);
  //     console.log(lines);
  //     const manualInvoice = {} as ManualInvoice; // MOCKED

  //     const newInvoiceData = {
  //       invoiceId: manualInvoice.invoiceId,
  //       markup: billingConfig.markup,
  //     } satisfies InvoiceData;

  //     algaEntries[swoStatement.id!] = newInvoiceData;
  //     storage.put(STORAGE_NAMESPACE, STORAGE_KEY, algaEntries);
  //   }
  // }
}
