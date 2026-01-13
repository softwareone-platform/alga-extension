import type {
  ListMetadata,
  Statement as SWOStatement,
} from "@swo/mp-api-model/billing";

export type InvoiceStatus = "no-invoice" | "to-invoice" | "invoiced";

export type Statement = {
  id: string;
  swo: SWOStatement;
  alga: {
    status: InvoiceStatus;
    invoiceId?: string;
    markup?: number;
  };
};

//API
export type StatementsResponseBody = {
  data: Statement[];
  $meta: ListMetadata;
};
