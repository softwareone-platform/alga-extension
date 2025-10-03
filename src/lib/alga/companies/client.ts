import { AxiosInstance } from "axios";
import { axiosInstance } from "../shared";
import { Company } from "./models";

export class CompaniesClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.axios = axiosInstance(baseUrl, apiKey);
  }

  async getCompanies(): Promise<Company[]> {
    const { data } = await this.axios.get<Company[]>("/companies");
    return data;
  }
}
