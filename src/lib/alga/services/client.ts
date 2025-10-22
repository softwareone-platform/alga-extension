import { AxiosInstance } from "axios";
import { axiosInstance, ListResponse, SingleResponse } from "../shared";
import { Client } from "./models";

export type AlgaClientResponse = {
  tenant: string;
  client_id: string;
  client_name: string;
  client_type: "company" | "individual";
  properties?: {
    website: string;
  };
};

export class ClientsClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.axios = axiosInstance(`${baseUrl}/api/v1/clients/`, apiKey);
  }

  async getClients(): Promise<ListResponse<Client>> {
    const { data } = await this.axios.get<ListResponse<AlgaClientResponse>>("");
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
    const { data } = await this.axios.get<SingleResponse<AlgaClientResponse>>(
      id
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
