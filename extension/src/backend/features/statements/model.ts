export type StatementDetails = {
  id: string;
  statementId: string;
  // status: StatementStatus; TODO: We do it in FE now because we can parallelize the requests.
  invoiceId?: string;
  markup: number;
  audit: {
    createdAt: string;
    invoicedAt?: string;
  };
};
