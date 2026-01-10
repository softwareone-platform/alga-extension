export type ManualInvoice = {
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  status: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  isManual: boolean;
};

export type ManualInvoiceLine = {
  serviceId: string;
  quantity: number;
  description: string;
  rate: number;
};
