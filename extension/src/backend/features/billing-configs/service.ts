import { StorageClient } from "../../lib/alga/storage";
import { BillingConfig, BillingConfigChange } from "./model";

const STORAGE_NAMESPACE = "swo.billing-configs";
const STORAGE_KEY = "billing-configs";

export class BillingConfigsService {
  private readonly storage: StorageClient;

  constructor(storage: StorageClient) {
    this.storage = storage;
  }

  getConfigs(): BillingConfig[] {
    return (
      this.storage.get<{ all: BillingConfig[] }>(STORAGE_NAMESPACE, STORAGE_KEY)
        ?.all ?? []
    );
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

    this.storage.put(STORAGE_NAMESPACE, STORAGE_KEY, { all: newConfigs });

    return newConfigs;
  }
}
