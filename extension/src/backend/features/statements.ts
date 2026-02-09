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
import { InvoiceLink } from "@/shared/invoices";
import { invoiceLinks } from "./invoice-links";
import {
  createManualInvoice,
  ManualInvoiceItemInput,
} from "alga:extension/invoicing";
import { ListOptions, optionsToUrl } from "@/shared/list-options";
import { getUser } from "alga:extension/user-v2";

const STATEMENTS_LIMIT = 100;
const CHARGES_LIMIT = 100;

const toLine = (
  charge: Charge,
  billingConfig: BillingConfig,
): ManualInvoiceItemInput | null => {
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
  } satisfies ManualInvoiceItemInput;
};

export class StatementService {
  private swoClient: SWOClient;

  constructor(swoClient: SWOClient) {
    this.swoClient = swoClient;
  }

  getById(id: string): Statement {
    const { data: statement } = this.swoClient.fetch<SWOStatement>(
      `/billing/statements/${id}?select=id,audit,type,agreement.id,agreement.name,product.id,product.name,product.icon,licensee.id,licensee.name,price.currency,price.totalSP,status`,
    );

    const bcs = billingConfigs.getConfigs();
    const billingConfig = bcs.find(
      (bc) =>
        bc.agreementId === statement.agreement?.id && bc.status === "active",
    );

    if (!billingConfig || statement.status !== "Issued") {
      return {
        ...statement,
        algaInvoiceStatus: "no-invoice",
      } satisfies Statement;
    }

    const ils = invoiceLinks.getLinks();
    const invoiceLink = ils.find((il) => il.statementId === id);

    if (!invoiceLink) {
      return {
        ...statement,
        algaInvoiceStatus: "to-invoice",
      } satisfies Statement;
    }

    return {
      ...statement,
      algaInvoiceStatus: "invoiced",
    } satisfies Statement;
  }

  list(options: ListOptions): ListResponse<Statement> {
    const { userType } = getUser();
    const bcs = billingConfigs.getConfigs();
    const billingConfigsByAgreementId = bcs.reduce(
      (acc, config) => {
        acc[config.agreementId] = config;
        return acc;
      },
      {} as Record<string, BillingConfig>,
    );

    const baseUrl = `/billing/statements?select=audit.created.at,audit.updated.at,seller.address.country,buyer.externalIds,client.externalId,client.externalIds,vendor.externalId,vendor.externalIds,seller.externalId,licensee.externalId,agreement.externalIds,customLedger.externalIds&${optionsToUrl(options)}`;
    const swoUrl =
      userType === "internal" ? baseUrl : `${baseUrl}&filter(group.buyers)`;

    const {
      data: { data: swoStatements, $meta },
    } = this.swoClient.fetch<StatementListResponse>(swoUrl);

    if (!swoStatements || !$meta) {
      return { data: [], $meta: { pagination: { total: 0 } } };
    }

    const ils = invoiceLinks.getLinks();
    const invoiceLinksByStatementId = ils.reduce(
      (acc, il) => {
        acc[il.statementId] = il;
        return acc;
      },
      {} as Record<string, InvoiceLink>,
    );

    const statements = swoStatements.map((swoStatement) => {
      if (!billingConfigsByAgreementId[swoStatement.agreement?.id ?? ""]) {
        return {
          ...swoStatement,
          algaInvoiceStatus: "no-invoice",
        } satisfies Statement;
      }

      if (!invoiceLinksByStatementId[swoStatement.id ?? ""]) {
        return {
          ...swoStatement,
          algaInvoiceStatus: "to-invoice",
        } satisfies Statement;
      }

      return {
        ...swoStatement,
        algaInvoiceStatus: "invoiced",
      } satisfies Statement;
    });

    return { data: statements, $meta };
  }

  invoiceStatement(statementId: string): Statement {
    const { data: swoStatement } = this.swoClient.fetch<SWOStatement>(
      `/billing/statements/${statementId}?select=id,agreement.id`,
    );

    const billingConfig = billingConfigs
      .getConfigs()
      .find((bc) => bc.agreementId === swoStatement.agreement?.id);
    if (!billingConfig) {
      throw new Error(
        `Billing config not found for agreement ${swoStatement.agreement?.id}`,
      );
    }

    const ils = invoiceLinks.getLinks();
    const invoiceLink = ils.find((il) => il.statementId === statementId);
    if (invoiceLink) {
      throw new Error(`Invoice already exists for statement ${statementId}`);
    }

    const charges = this.fetchAllCharges(swoStatement.id!);
    if (charges.length === 0) {
      throw new Error(`No charges found for statement ${statementId}`);
    }

    const lines = charges
      .map((charge) => toLine(charge, billingConfig))
      .filter((line): line is ManualInvoiceItemInput => !!line);

    const invoice = {
      clientId: billingConfig.consumerId,
      items: lines,
    };

    const { invoiceId, error, success } = createManualInvoice(invoice);
    const errorMessage = error ?? "Unknown error creating invoice";

    if (!success) {
      throw new Error(`${errorMessage} for ${JSON.stringify(invoice)}`);
    }

    invoiceLinks.saveLinks([
      ...ils,
      {
        invoiceId: invoiceId!,
        statementId,
        markupSnapshot: billingConfig.markup,
      },
    ]);

    return {
      ...swoStatement,
      algaInvoiceStatus: "invoiced",
    } satisfies Statement;
  }

  invoiceAll(): void {
    const bcs = billingConfigs.getConfigs();
    const billingConfigsByAgreementId = bcs.reduce(
      (acc, config) => {
        acc[config.agreementId] = config;
        return acc;
      },
      {} as Record<string, BillingConfig>,
    );

    const ils = invoiceLinks.getLinks();
    const invoiceLinksByStatementId = ils.reduce(
      (acc, il) => {
        acc[il.statementId] = il;
        return acc;
      },
      {} as Record<string, InvoiceLink>,
    );

    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);
    const to = toDate.toISOString().split("T")[0];

    const fromDate = new Date(toDate);
    fromDate.setMonth(fromDate.getMonth() - 3);
    const from = fromDate.toISOString().split("T")[0];

    let offset = 0;

    while (true) {
      const {
        data: { data: swoStatements, $meta },
      } = this.swoClient.fetch<StatementListResponse>(
        `/billing/statements?select=id,audit,agreement.id&filter(group.buyers)&and(gt(audit.created.at,%22${from}T22%3A00%3A00.000Z%22),lt(audit.created.at,%22${to}T23%3A00%3A00.000Z%22),eq(status,%22Issued%22))&order=-audit.created.at&offset=${offset}&limit=${STATEMENTS_LIMIT}`,
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

        const invoiceLink = invoiceLinksByStatementId[swoStatement.id!];
        if (invoiceLink) {
          continue;
        }

        const charges = this.fetchAllCharges(swoStatement.id!);
        if (charges.length === 0) {
          continue;
        }

        const lines = charges
          .map((charge) => toLine(charge, billingConfig))
          .filter((line): line is ManualInvoiceItemInput => !!line);

        try {
          const { invoiceId, error, success } = createManualInvoice({
            clientId: billingConfig.consumerId,
            items: lines,
          });

          if (!success) {
            throw new Error(error ?? "Unknown error creating invoice");
          }

          invoiceLinks.saveLinks([
            ...ils,
            {
              invoiceId: invoiceId!,
              statementId: swoStatement.id!,
              markupSnapshot: billingConfig.markup,
            },
          ]);
        } catch (error) {
          console.warn(
            `Failed to create invoice for statement ${swoStatement.id}: ${error}`,
          );
        }
      }

      offset += STATEMENTS_LIMIT;
    }
  }

  private fetchAllCharges(statementId: string): Charge[] {
    let offset = 0;
    const charges: Charge[] = [];

    while (true) {
      const {
        data: { data, $meta },
      } = this.swoClient.fetch<ChargeListResponse>(
        `/billing/statements/${statementId}/charges?select=id,subscription.id,subscription.name,item.id,item.name,period.start,period.end,quantity,price.SPx1,price.unitSP&offset=${offset}&limit=${CHARGES_LIMIT}`,
      );

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
