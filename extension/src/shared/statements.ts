import type {
  ListMetadata,
  Statement as SWOStatement,
} from "@swo/mp-api-model/billing";

export type InvoiceStatus = "no-invoice" | "to-invoice" | "invoiced";

export type Statement = SWOStatement & {
  algaInvoiceStatus: InvoiceStatus;
};

//API
export type StatementsResponseBody = {
  data: Statement[];
  $meta: ListMetadata;
};
