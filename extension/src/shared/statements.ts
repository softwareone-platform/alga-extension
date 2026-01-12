import type { Statement as SWOStatement } from "@swo/mp-api-model/billing";

export type InvoiceStatus = "no-invoice" | "to-invoice" | "invoiced";

export type Statement = {
  id: string;
  swo: SWOStatement;
  alga: {
    status: InvoiceStatus;
    id: string;
    markup: number;
    audit: {
      invoicedAt: string;
    };
  };
};
