import { callProxy, type UiProxyHost } from "@lib/proxy";
import { ListResponse, SingleResponse } from "../shared";
import { Client } from "./models";

type AlgaClientResponse = {
  tenant: string;
  client_id: string;
  client_name: string;
  client_type: "company" | "individual";
  properties?: {
    website: string;
  };
};

export class ClientsClient {
  private uiProxy: UiProxyHost;

  constructor(uiProxy: UiProxyHost) {
    this.uiProxy = uiProxy;
  }

  async getClients(): Promise<ListResponse<Client>> {
    const data = await callProxy<ListResponse<AlgaClientResponse>>(
      this.uiProxy,
      "/alga/clients/list"
    );
    return {
      data: data.data.map((company) => ({
        id: company.client_id,
        tenantId: company.tenant,
        name: company.client_name,
        type: company.client_type,
        website: company.properties?.website,
      })),
      pagination: data.pagination,
      meta: data.meta,
    };
  }

  async getClient(id: string): Promise<Client | null> {
    const data = await callProxy<SingleResponse<AlgaClientResponse>>(
      this.uiProxy,
      "/alga/clients/get",
      { id }
    );
    return data.data
      ? {
          id: data.data.client_id,
          tenantId: data.data.tenant,
          name: data.data.client_name,
          type: data.data.client_type,
          website: data.data.properties?.website,
        }
      : null;
  }
}
