import { BillingConfig, BillingConfigChange } from "@/shared/billing-configs";
import { storage } from "../lib/alga";
import { getUser } from "alga:extension/user-v2";

const STORAGE_NAMESPACE = "swo.billing-configs";
const STORAGE_KEY = "billing-configs";

const toConfigs = (
  changes: BillingConfigChange[],
  existing: BillingConfig[],
): BillingConfig[] => {
  const now = new Date().toISOString();

  const byId = existing.reduce(
    (acc, config) => {
      acc[config.id] = config;
      return acc;
    },
    {} as Record<string, BillingConfig>,
  );

  return changes.map((config) => {
    const existingConfig = byId[config.agreementId];
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
};

export const billingConfigs = {
  getConfigs: (): BillingConfig[] => {
    const { userType, tenantId } = getUser();

    const { all } = storage.get<{ all: BillingConfig[] }>(
      STORAGE_NAMESPACE,
      STORAGE_KEY,
    ) || { all: [] };

    return userType === "internal"
      ? all
      : all.filter((v) => v.consumerId === tenantId);
  },
  saveConfigs: (changes: BillingConfigChange[]): BillingConfig[] => {
    const user = getUser();

    if (user.userType !== "internal") {
      throw new Error("Unauthorized");
    }

    const existing = billingConfigs.getConfigs();
    const configs = toConfigs(changes, existing);

    storage.put(STORAGE_NAMESPACE, STORAGE_KEY, { all: configs });
    return configs;
  },
};

export type BillingConfigs = typeof billingConfigs;
