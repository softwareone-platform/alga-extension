import { callProxy, type UiProxyHost } from "@lib/proxy";
import { ListResponse, SingleResponse } from "../shared";
import { Service } from "./models";

type AlgaServiceResponse = {
  service_id: string;
  tenant: string;
  service_name: string;
};

export class ServicesClient {
  private uiProxy: UiProxyHost;

  constructor(uiProxy: UiProxyHost) {
    this.uiProxy = uiProxy;
  }

  async getServices(): Promise<ListResponse<Service>> {
    const data = await callProxy<ListResponse<AlgaServiceResponse>>(
      this.uiProxy,
      "/alga/services/list"
    );
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
    const data = await callProxy<SingleResponse<AlgaServiceResponse>>(
      this.uiProxy,
      "/alga/services/get",
      { id }
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
