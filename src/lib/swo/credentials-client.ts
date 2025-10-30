import { AxiosInstance } from "axios";
import { axiosInstance } from "./shared";

export type Credentials = {
  agreementId: string;
  swoAPIToken: string;
  algaAPIKey: string;
};

export class CredentialsClient {
  private axios: AxiosInstance;
  private swoToken: string;
  private algaKey: string;

  constructor(baseUrl: string, swoToken: string, algaKey: string) {
    this.axios = axiosInstance(baseUrl, swoToken);
    this.swoToken = swoToken;
    this.algaKey = algaKey;
  }

  async upsert(agreementId: string): Promise<Credentials> {
    const credentials = {
      agreementId,
      swoAPIToken: this.swoToken,
      algaAPIKey: this.algaKey,
    };
    await this.axios.post(`v1/credentials`, credentials);

    return credentials;
  }

  async delete(agreementId: string): Promise<void> {
    await this.axios.delete(`v1/credentials/${agreementId}`);
  }
}
