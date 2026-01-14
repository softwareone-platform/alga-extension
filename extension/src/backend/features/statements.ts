import { storage } from "../lib/alga/storage";
import { Statement } from "@/shared/statements";
import { Charge, Statement as SWOStatement } from "@swo/mp-api-model/billing";
import { BillingConfig } from "@/shared/billing-configs";
import { billingConfigs } from "./billing-configs";
import { ManualInvoice, ManualInvoiceLine } from "../lib/alga";
import { StatementsClient } from "../lib/swo";
import { extension } from "./extension";

const STORAGE_NAMESPACE = "swo.statements";
const STORAGE_KEY = "all";

type InvoiceData = {
  invoiceId: string;
  markup: number;
};

const toLine = (
  charge: Charge,
  billingConfig: BillingConfig
): ManualInvoiceLine | null => {
  if (!charge.price?.unitSP) {
    console.warn(`No price for charge ${charge.id}`);
    return null;
  }

  const description = `${charge.item?.name || charge.description?.value1} (${
    charge.id
  })`;

  const rate = Math.round(
    charge.price.unitSP * (1 + billingConfig.markup / 100) * 100
  );

  return {
    serviceId: billingConfig.serviceId,
    quantity: charge.quantity ?? 0,
    description,
    rate,
  } satisfies ManualInvoiceLine;
};

const toStatements = (
  swoStatements: SWOStatement[],
  invoicesData: Record<string, InvoiceData>,
  billingConfigs: BillingConfig[]
): Statement[] => {
  const billingConfigsByAgreementId = billingConfigs.reduce((acc, config) => {
    acc[config.agreementId] = config;
    return acc;
  }, {} as Record<string, BillingConfig>);

  return swoStatements.map((swoStatement) => {
    const billingConfig = swoStatement.agreement?.id
      ? billingConfigsByAgreementId[swoStatement.agreement.id]
      : null;

    if (!billingConfig) {
      return {
        id: swoStatement.id!,
        swo: swoStatement,
        alga: {
          status: "no-invoice",
        },
      };
    }

    const invoiceData = invoicesData[swoStatement.id!];
    if (!invoiceData) {
      return {
        id: swoStatement.id!,
        swo: swoStatement,
        alga: {
          status: "to-invoice",
        },
      };
    }

    return {
      id: swoStatement.id!,
      swo: swoStatement,
      alga: {
        status: "invoiced",
        invoiceId: invoiceData.invoiceId,
        markup: invoiceData.markup,
      },
    };
  });
};

export const statements = {
  get: (statements: SWOStatement[]): Statement[] => {
    const invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY
      ) ?? {};

    const bcs = billingConfigs.getConfigs();

    return toStatements(statements, invoicesData, bcs);
  },
  createInvoices: (statements: SWOStatement[]) => {
    const bcs = billingConfigs.getConfigs();
    const billingConfigsByAgreementId = bcs.reduce((acc, config) => {
      acc[config.agreementId] = config;
      return acc;
    }, {} as Record<string, BillingConfig>);

    let invoicesData =
      storage.get<Record<string, InvoiceData>>(
        STORAGE_NAMESPACE,
        STORAGE_KEY
      ) || {};

    for (const swoStatement of statements) {
      const billingConfig = swoStatement.agreement?.id
        ? billingConfigsByAgreementId[swoStatement.agreement.id]
        : null;

      if (
        !billingConfig ||
        !billingConfig.serviceId ||
        billingConfig.markup === undefined
      ) {
        // not billable
        continue;
      }

      const invoiceData = invoicesData[swoStatement.id!];
      if (!!invoiceData) {
        // already invoiced
        continue;
      }

      const { endpoint, token } = extension.getDetails();
      const swoClient = new StatementsClient(endpoint, token);

      const charges = swoClient.getCharges(swoStatement.id!);
      if (charges.length === 0) {
        // no charges
        continue;
      }

      const lines = charges
        .map((charge) => toLine(charge, billingConfig))
        .filter((line) => !!line);
      console.log(lines);
      const manualInvoice = {} as ManualInvoice; // MOCKED

      const newInvoiceData = {
        invoiceId: manualInvoice.invoiceId,
        markup: billingConfig.markup,
      } satisfies InvoiceData;

      invoicesData[swoStatement.id!] = newInvoiceData;
      storage.put(STORAGE_NAMESPACE, STORAGE_KEY, invoicesData);
    }
  },
};
