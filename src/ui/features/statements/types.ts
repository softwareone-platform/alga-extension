import {
  InvoiceStatus as SharedInvoiceStatus,
  Statement as SharedStatement,
} from "@/shared/statements";

export type InvoiceStatus = SharedInvoiceStatus | "invoicing";

export type Statement = SharedStatement & {
  algaInvoiceStatus: InvoiceStatus;
};
