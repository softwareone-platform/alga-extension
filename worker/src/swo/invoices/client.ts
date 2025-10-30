import axios, { type AxiosInstance } from "axios";
import type { Invoice } from "./models";

export const axiosInstance = (baseURL: string, token: string) =>
  axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export type InvoicesResponse = {
  $meta: {
    pagination: {
      offset: number;
      limit: number;
      total: number;
    };
  };
  data: Invoice[];
};

export class InvoicesClient {
  private axios: AxiosInstance;
  private PAGE_SIZE = 10;

  constructor(baseURL: string, token: string) {
    this.axios = axiosInstance(baseURL, token);
  }

  async *getMany({
    agreementId,
    before,
    after,
  }: {
    agreementId: string;
    before: Date;
    after: Date;
  }): AsyncGenerator<Invoice> {
    const from = encodeURIComponent(before.toISOString());
    const to = encodeURIComponent(after.toISOString());

    let i = 0;

    while (true) {
      const offset = i * this.PAGE_SIZE;
      const q = `v1/billing/invoices?select=audit.created.at,audit.updated.at,lines,agreement.id&filter(group.buyers)&and(eq(agreement.id,%22${agreementId}%22),gt(attributes.documentDate,%22${from}%22),lt(attributes.documentDate,%22${to}%22))&order=-audit.created.at&offset=${offset}&limit=${this.PAGE_SIZE}`;
      const {
        data: {
          data: invoices,
          $meta: { pagination },
        },
      } = await this.axios.get<InvoicesResponse>(q);

      yield* invoices;

      if (pagination.total <= offset + this.PAGE_SIZE) break;

      i++;
    }
  }
}
