import { storage } from "../lib/alga/storage";
import { Statement } from "@/shared/statements";
import {
  Charge,
  ChargeListResponse,
  Statement as SWOStatement,
} from "@swo/mp-api-model/billing";
import { BillingConfig } from "@/shared/billing-configs";
import { billingConfigs } from "./billing-configs";
import { RqlQuery } from "@swo/rql-client";
import { extension } from "./extension";
import { fetch as httpFetch } from "alga:extension/http";
import { decode } from "../lib/alga";

const CHARGES_LIMIT = 100;
const STORAGE_NAMESPACE = "swo.invoices";
const STORAGE_KEY = "all";

type Invoice = {
  statementId: string;
  invoiceId: string;
  audit: {
    createdAt: string;
  };
};

export const getCharges = (statementId: string): Charge[] => {
  let offset = 0;
  const { token, endpoint, status } = extension.getDetails();

  if (status !== "active") {
    throw new Error("Extension is not active");
  }

  const charges: Charge[] = [];

  while (true) {
    const query = new RqlQuery<Charge>();
    query
      .expand(
        "id",
        "subscription.id",
        "subscription.name",
        "item.id",
        "item.name",
        "period.start",
        "period.end",
        "quantity",
        "price.SPx1",
        "price.unitSP"
      )
      .paging(offset, CHARGES_LIMIT);

    const response = httpFetch({
      method: "GET",
      url: `${endpoint}/billing/statements/${statementId}/charges?${query.toString()}`,
      headers: [
        { name: "Authorization", value: `Bearer ${token}` },
        { name: "Content-Type", value: "application/json" },
      ],
    });

    const responseBody = decode<ChargeListResponse>(response.body);
    if (!responseBody) {
      throw new Error(`Failed to get charges for statement ${statementId}`);
    }
    charges.push(...(responseBody.data || []));

    offset += CHARGES_LIMIT;

    const total = responseBody.$meta?.pagination?.total || 0;
    if (total <= offset) {
      break;
    }
  }

  return charges;
};

const toStatements = (
  swoStatements: SWOStatement[],
  billingConfigs: BillingConfig[],
  invoices: Invoice[]
): Statement[] => {
  const billingConfigsByAgreementId = billingConfigs.reduce((acc, config) => {
    acc[config.agreementId] = config;
    return acc;
  }, {} as Record<string, BillingConfig>);

  const invoicesByStatementId = invoices.reduce((acc, invoice) => {
    acc[invoice.statementId] = invoice;
    return acc;
  }, {} as Record<string, Invoice>);

  return swoStatements.map((swoStatement) => {
    const billingConfig = swoStatement.agreement?.id
      ? billingConfigsByAgreementId[swoStatement.agreement.id]
      : null;

    if (!billingConfig) {
      return {
        ...swoStatement,
        algaInvoiceStatus: "no-invoice",
      };
    }

    const invoice = invoicesByStatementId[swoStatement.id!];
    if (!invoice) {
      return {
        ...swoStatement,
        algaInvoiceStatus: "to-invoice",
      };
    }

    return {
      ...swoStatement,
      algaInvoiceStatus: "invoiced",
    };
  });
};

export const statements = {
  get: (swoStatements: SWOStatement[]): Statement[] => {
    const invoices =
      storage.get<{ all: Invoice[] }>(STORAGE_NAMESPACE, STORAGE_KEY)?.all ??
      [];

    const bcs = billingConfigs.getConfigs();

    return toStatements(swoStatements, bcs, invoices);
  },
  invoice: (swoStatements: SWOStatement[]) => {},
};
