import type {
  ListMetadata,
  Statement as SWOStatement,
} from "@swo/mp-api-model/billing";
export type InvoiceStatus = "no-invoice" | "to-invoice" | "invoiced";

export type AlgaStatementDetails = {
  statementId: string;
  status: InvoiceStatus;
  invoice?: {
    id: string;
    markup: number;
  };
  audit: {
    createdAt: string;
    invoicedAt?: string;
  };
};

export type Statement = {
  id: string;
  swoStatement: SWOStatement;
  algaStatementDetails: AlgaStatementDetails;
};

//API
export type StatementsResponseBody = {
  data: Statement[];
  $meta: ListMetadata;
};
