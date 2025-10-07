import { AxiosInstance } from "axios";
import { axiosInstance } from "../shared";
import { Company, ListResponse, SingleResponse } from "./models";

export type AlgaCompanyResponse = {
  tenant: string;
  company_id: string;
  company_name: string;
  client_type: "company" | "individual";
  properties?: {
    website: string;
  };
};

export type CompaniesResponse = ListResponse<Company>;

export class CompaniesClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.axios = axiosInstance(baseUrl, apiKey);
  }

  async getCompanies(): Promise<CompaniesResponse> {
    const { data } = await this.axios.get<ListResponse<AlgaCompanyResponse>>(
      "/companies"
    );
    return {
      data: data.data.map((company) => ({
        id: company.company_id,
        tenantId: company.tenant,
        name: company.company_name,
        type: company.client_type,
        website: company.properties?.website,
      })),
      pagination: data.pagination,
      meta: data.meta,
    };
  }

  async getCompany(id: string): Promise<Company | null> {
    const { data } = await this.axios.get<SingleResponse<AlgaCompanyResponse>>(
      `/companies/${id}`
    );
    return data.data
      ? {
          id: data.data.company_id,
          tenantId: data.data.tenant,
          name: data.data.company_name,
          type: data.data.client_type,
          website: data.data.properties?.website,
        }
      : null;
  }
}
