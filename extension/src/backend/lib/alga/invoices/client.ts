import { decode, encode } from "../utils";
import { ManualInvoice, ManualInvoiceLine } from "./model";
import { fetch as httpFetch } from "alga:extension/http";

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
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  create(clientId: string, lines: ManualInvoiceLine[]): ManualInvoice | null {
    const items = lines.map(
      (line) =>
        ({
          service_id: line.serviceId,
          quantity: line.quantity,
          description: line.description,
          rate: line.rate,
        } satisfies APIManualInvoiceLine)
    );

    const response = httpFetch({
      method: "POST",
      url: `${this.baseUrl}/api/v1/invoices/manual`,
      body: encode({
        clientId,
        items,
      }),
      headers: [
        { name: "Content-Type", value: "application/json" },
        { name: "x-api-key", value: this.apiKey },
      ],
    });

    const responseBody = decode<ApiSuccessResponse<APIManualInvoice>>(
      response.body
    );
    if (!responseBody?.data) return null;

    return {
      invoiceId: responseBody.data.invoice_id,
      invoiceNumber: responseBody.data.invoice_number,
      clientId: responseBody.data.client_id,
      status: responseBody.data.status,
      subtotal: responseBody.data.subtotal,
      tax: responseBody.data.tax,
      totalAmount: responseBody.data.total_amount,
      isManual: responseBody.data.is_manual,
    } satisfies ManualInvoice;
  }
}
