import { KVStorage } from "../kv-storage";
import type { BillingConfig } from "./models";

const BY_AGREEMENT = "billing-configs-by-agreement";

export type BillingConfigChanges = Omit<
  BillingConfig,
  "audit" | "status" | "id"
> & {
  id?: string;
};

type BillingConfigKV = Omit<BillingConfig, "audit" | "status">;

export class BillingConfigClient {
  constructor(private kvStorage: KVStorage) {}

  async getByAgreementId(agreementId: string): Promise<BillingConfig | null> {
    const result = await this.kvStorage.get<BillingConfigKV>(
      `${BY_AGREEMENT}-${agreementId}-${agreementId}`
    );

    return result?.value
      ? {
          ...result.value,
          status: result.value.consumer ? "active" : "unconfigured",
          audit: {
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          },
        }
      : null;
  }
}
