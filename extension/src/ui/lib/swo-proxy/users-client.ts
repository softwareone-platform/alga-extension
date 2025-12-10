import { UserQueryModel, UserQueryModelListResponse } from "@swo/mp-api-model";
import { callProxy, type UiProxyHost } from "@lib/proxy";
import { ProxyClientConfig } from "./shared";

export class UsersClient {
  private uiProxy: UiProxyHost;

  constructor(config: ProxyClientConfig) {
    this.uiProxy = config.uiProxy;
  }

  async getUser(): Promise<UserQueryModel> {
    const response = await callProxy<UserQueryModelListResponse>(
      this.uiProxy,
      "/swo/users/get"
    );
    return response.data![0];
  }
}
