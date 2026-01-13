import { storage } from "../lib/alga/storage";
import { Statement } from "@/shared/statements";
import { Statement as SWOStatement } from "@swo/mp-api-model/billing";
import { BillingConfig } from "@/shared/billing-configs";
import { billingConfigs } from "./billing-configs";

const STORAGE_NAMESPACE = "swo.invoices";
const STORAGE_KEY = "all";

type Invoice = {
  statementId: string;
  invoiceId: string;
  audit: {
    createdAt: string;
  };
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
  invoice: () => {},
};
