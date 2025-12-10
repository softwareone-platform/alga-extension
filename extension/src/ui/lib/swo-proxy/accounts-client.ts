import {
  AccountQueryModelListResponse,
  AccountQueryModel,
} from "@swo/mp-api-model";
import { callProxy, type UiProxyHost } from "@lib/proxy";
import { ProxyClientConfig } from "./shared";

export class AccountsClient {
  private uiProxy: UiProxyHost;

  constructor(config: ProxyClientConfig) {
    this.uiProxy = config.uiProxy;
  }

  async getAccount(): Promise<AccountQueryModel> {
    const response = await callProxy<AccountQueryModelListResponse>(
      this.uiProxy,
      "/swo/accounts/get"
    );
    return response.data![0];
  }
}
