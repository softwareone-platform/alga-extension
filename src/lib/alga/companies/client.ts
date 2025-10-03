import { AxiosInstance } from "axios";
import { axiosInstance } from "../shared";
import {
  CompanyResponse,
  Company,
  ListResponse,
  SingleResponse,
} from "./models";

export type CompaniesResponse = ListResponse<Company>;

export class CompaniesClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.axios = axiosInstance(baseUrl, apiKey);
  }

  async getCompanies(): Promise<CompaniesResponse> {
    const { data } = await this.axios.get<ListResponse<CompanyResponse>>(
      "/companies"
    );
    return {
      data: data.data.map((company) => ({
        id: company.company_id,
        tenantId: company.tenant,
        name: company.company_name,
      })),
      pagination: data.pagination,
      meta: data.meta,
    };
  }

  async getCompany(id: string): Promise<Company | null> {
    const { data } = await this.axios.get<SingleResponse<CompanyResponse>>(
      `/companies/${id}`
    );
    return data.data
      ? {
          id: data.data.company_id,
          tenantId: data.data.tenant,
          name: data.data.company_name,
        }
      : null;
  }
}
