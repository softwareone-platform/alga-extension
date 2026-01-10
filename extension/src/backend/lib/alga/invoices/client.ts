type APIManualInvoice = {
  invoice_id: string;
  invoice_number: string;
  client_id: string;
  status: string;
  subtotal: number;
  tax: number;
  total_amount: number;
  is_manual: boolean;
};

type APIManualInvoiceLine = {
  service_id: string;
  quantity: number;
  description: string;
  rate: number;
};

type ApiSuccessResponse<T> = {
  data: T;
  meta?: unknown;
};

export class InvoicesClient {
  create(clientId: string, lines: ManualInvoiceLine[]): ManualInvoice | null {
    // const response = await this.axios.post<ApiSuccessResponse<ManualInvoice>>(
    //   "/manual",
    //   {
    //     clientId,
    //     items: lines,
    //   }
    // );

    // if (response.status !== 201) {
    //   throw new Error(`Failed to create invoice: ${response}`);
    // }

    // return response.data.data;

    console.log("clientId", clientId);
    console.log("lines", lines);

    return null;
  }
}
