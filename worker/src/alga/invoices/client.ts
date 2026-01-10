import type { AxiosInstance } from "axios";
import { axiosInstance } from "../shared";

type ApiSuccessResponse<T> = {
  data: T;
  meta?: unknown;
};

export type CreateInvoiceData = {
  clientId: string;
  lines: ManualInvoiceLine[];
  externalInvoiceId: string;
};

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

export class InvoicesClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.axios = axiosInstance(`${baseUrl}v1/invoices`, apiKey);
  }

  async create({
    clientId,
    lines,
  }: CreateInvoiceData): Promise<ManualInvoice | null> {
    const response = await this.axios.post<ApiSuccessResponse<ManualInvoice>>(
      "/manual",
      {
        clientId,
        items: lines,
      }
    );

    if (response.status !== 201) {
      throw new Error(`Failed to create invoice: ${response}`);
    }

    return response.data.data;
  }
}
