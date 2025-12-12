import axios, { AxiosInstance } from "axios";
import {
  AccountQueryModelListResponse,
  AccountQueryModel,
} from "@swo/mp-api-model";

export class AccountsClient {
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({ baseURL });
  }

  async getAccount(): Promise<AccountQueryModel> {
    const { data } = await this.axios.get<AccountQueryModelListResponse>(
      `/accounts/accounts`
    );
    return data.data![0];
  }
}
