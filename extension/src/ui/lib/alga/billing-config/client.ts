import { KVStorage } from "@lib/alga";
import { BillingConfig } from "./models";

const BILLING_CONFIGS = "billing-configs";

export type BillingConfigChanges = Omit<
  BillingConfig,
  "audit" | "status" | "id" | "markup"
> & {
  id?: string;
  markup?: number;
};

export class BillingConfigClient {
  private kvStorage: KVStorage;

  constructor(kvStorage: KVStorage) {
    this.kvStorage = kvStorage;
  }

  async getAll(): Promise<BillingConfig[]> {
    const result = await this.kvStorage.get<{ all: BillingConfig[] } | null>(
      BILLING_CONFIGS
    );

    return result?.value?.all || [];
  }

  async save(changes: BillingConfigChanges): Promise<BillingConfig> {
    const all = await this.getAll();

    const existing = changes.id ? all.find((v) => v.id === changes.id) : null;

    const merged = {
      ...existing,
      ...changes,
    };

    const status =
      merged.consumer && merged.service ? "active" : "unconfigured";
    const id = merged.id || merged.agreementId;
    const audit = {
      createdAt: existing?.audit.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const markup = merged.markup || 0;

    const newBillingConfig = {
      ...merged,
      id,
      status,
      audit,
      markup,
    } satisfies BillingConfig;

    await this.kvStorage.set(BILLING_CONFIGS, {
      all: [...all.filter((v) => v.id !== id), newBillingConfig],
    });

    return newBillingConfig;
  }
}
