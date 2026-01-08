import { BillingConfig, BillingConfigChange } from "@/shared/billing-configs";
import { StorageClient } from "../storage-client";

const STORAGE_KEY = "billing-configs";
const STORAGE_NAMESPACE = "billing-configs";

export class BillingConfigsService {
  private readonly storage: StorageClient;

  constructor() {
    this.storage = new StorageClient(STORAGE_NAMESPACE);
  }

  getConfigs(): BillingConfig[] {
    return this.storage.get<{ all: BillingConfig[] }>(STORAGE_KEY)?.all ?? [];
  }

  saveConfigs(configs: BillingConfigChange[]): BillingConfig[] {
    const now = new Date().toISOString();
    const existingConfigs = this.getConfigs();

    const existingConfigsById = existingConfigs.reduce((acc, config) => {
      acc[config.id] = config;
      return acc;
    }, {} as Record<string, BillingConfig>);

    const newConfigs: BillingConfig[] = configs.map((config) => {
      const existingConfig = existingConfigsById[config.agreementId];
      return {
        ...config,
        id: existingConfig?.id || config.agreementId,
        status:
          config.consumerId && config.serviceId && config.markup !== undefined
            ? "active"
            : "unconfigured",
        audit: {
          createdAt: existingConfig?.audit.createdAt || now,
          updatedAt: now,
        },
      };
    });

    this.storage.put(STORAGE_KEY, { all: newConfigs });

    return newConfigs;
  }
}
