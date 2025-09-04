import { AxiosInstance } from "axios";
import { axiosInstance } from "./shared";
import {
  AccountQueryModelListResponse,
  AccountQueryModel,
} from "@swo/mp-api-model";

export class AccountsClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axios = axiosInstance(baseUrl, token);
  }

  async getAccount(): Promise<AccountQueryModel> {
    const { data } = await this.axios.get<AccountQueryModelListResponse>(
      `/accounts/accounts`
    );
    return data.data![0];
  }
}
