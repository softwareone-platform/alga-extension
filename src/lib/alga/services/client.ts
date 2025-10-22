import { AxiosInstance } from "axios";
import { axiosInstance, ListResponse, SingleResponse } from "../shared";
import { Service } from "./models";

type AlgaClientResponse = {
  service_id: string;
  tenant: string;
  service_name: string;
};

export class ServicesClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.axios = axiosInstance(`${baseUrl}/api/v1/clients/`, apiKey);
  }

  async getServices(): Promise<ListResponse<Service>> {
    const { data } = await this.axios.get<ListResponse<AlgaClientResponse>>("");
    return {
      data: data.data.map((service) => ({
        id: service.service_id,
        tenantId: service.tenant,
        name: service.service_name,
      })),
      pagination: data.pagination,
      meta: data.meta,
    };
  }

  async getService(id: string): Promise<Service | null> {
    const { data } = await this.axios.get<SingleResponse<AlgaClientResponse>>(
      id
    );
    return data.data
      ? {
          id: data.data.service_id,
          tenantId: data.data.tenant,
          name: data.data.service_name,
        }
      : null;
  }
}
