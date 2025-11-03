import type { AxiosInstance } from "axios";
import { axiosInstance } from "../shared";
import type { ManualInvoice, ManualInvoiceLine } from "./models";

type ApiSuccessResponse<T> = {
  data: T;
  meta?: unknown;
};

export type CreateInvoiceData = {
  clientId: string;
  lines: ManualInvoiceLine[];
  externalInvoiceId: string;
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
