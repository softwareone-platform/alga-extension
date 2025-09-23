import { KVStorage } from "@lib/alga";
import { BillingConfig } from "./models";

const BILLING_CONFIGS_STORAGE_KEY = "billing-configs";

export type BillingConfigChanges = Omit<
  BillingConfig,
  "updatedAt" | "status" | "id"
> & {
  id?: string;
};

export class BillingConfigClient {
  private kvStorage: KVStorage;

  constructor(kvStorage: KVStorage) {
    this.kvStorage = kvStorage;
  }

  async getBillingConfig(id: string): Promise<BillingConfig | null> {
    return await this.kvStorage.get<BillingConfig>(
      `${BILLING_CONFIGS_STORAGE_KEY}:${id}`
    );
  }

  async getBillingConfigs(ids: string[]): Promise<BillingConfig[]> {
    // TODO: Temp
    return await Promise.all(ids.map((id) => this.getBillingConfig(id))).then(
      (bcs) => bcs.filter((bc) => !!bc)
    );
  }

  async saveBillingConfig(
    changes: BillingConfigChanges
  ): Promise<BillingConfig> {
    const bc = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await this.kvStorage.set(`${BILLING_CONFIGS_STORAGE_KEY}:${bc.id}`, bc);

    return bc;
  }
}
