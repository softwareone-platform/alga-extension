export type ManualInvoice = {
  invoice_id: string;
  invoice_number: string;
  client_id: string;
  status: string;
  subtotal: number;
  tax: number;
  total_amount: number;
  is_manual: boolean;
};

export type ManualInvoiceLine = {
  service_id: string;
  quantity: number;
  description: string;
  rate: number;
};
