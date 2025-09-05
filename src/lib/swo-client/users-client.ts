import { AxiosInstance } from "axios";
import { axiosInstance } from "./shared";
import { UserQueryModel, UserQueryModelListResponse } from "@swo/mp-api-model";

export class UsersClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axios = axiosInstance(baseUrl, token);
  }

  async getUser(): Promise<UserQueryModel> {
    const { data } = await this.axios.get<UserQueryModelListResponse>(
      `/accounts/users`
    );
    return data.data![0];
  }
}
