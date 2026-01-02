import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { logError, logInfo, logWarn } from "alga:extension/logging";
import { get as getStorage, put as putStorage } from "alga:extension/storage";
import { decode, encode, jsonResponse } from "../utils";
import type {
  BillingConfig,
  BillingConfigsRequestBody,
  BillingConfigsResponseBody,
} from "@/lib/billing-config";

const STORAGE_KEY = "billing-configs";
const STORAGE_NAMESPACE = "billing-configs";

const getBillingConfigs = (): BillingConfig[] => {
  try {
    const entry = getStorage(STORAGE_NAMESPACE, STORAGE_KEY);
    if (entry) {
      const data = decode<{ all: BillingConfig[] }>(entry.value);
      return data?.all ?? [];
    }
    return [];
  } catch (error) {
    logWarn(`Could not getbilling configs: ${error}`);
    return [];
  }
};

const saveBillingConfigs = (configs: BillingConfig[]): void => {
  const value = encode({ all: configs });
  putStorage({
    namespace: STORAGE_NAMESPACE,
    key: STORAGE_KEY,
    value,
  });
};

export const billingConfigHandler = (
  request: ExecuteRequest
): ExecuteResponse => {
  const method = request.http.method;

  if (method === "GET") {
    logInfo(`Getting billing configs...`);
    const configs = getBillingConfigs();
    const response: BillingConfigsResponseBody = configs;
    return jsonResponse(response, { status: 200 });
  }

  if (method === "POST") {
    logInfo(`Saving billing configs...`);
    try {
      const newConfigsRequestData =
        decode<BillingConfigsRequestBody>(request.http.body) || [];

      if (!Array.isArray(newConfigsRequestData)) {
        logWarn(`Invalid request body, expected array`);
        return jsonResponse(
          { error: "Invalid request body, expected array" },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();
      const existingConfigs = getBillingConfigs();

      const existingConfigsById = existingConfigs.reduce((acc, config) => {
        acc[config.id] = config;
        return acc;
      }, {} as Record<string, BillingConfig>);

      const newConfigs: BillingConfig[] = newConfigsRequestData.map(
        (config) => {
          const existingConfig = existingConfigsById[config.agreementId];
          return {
            ...config,
            id: existingConfig?.id || config.agreementId,
            status:
              config.consumerId &&
              config.serviceId &&
              config.markup !== undefined
                ? "active"
                : "unconfigured",
            audit: {
              createdAt: existingConfig?.audit.createdAt || now,
              updatedAt: now,
            },
          };
        }
      );
      saveBillingConfigs(newConfigs);
      return jsonResponse(newConfigs, { status: 200 });
    } catch (error) {
      logError(`Error handling POST request: ${error}`);
      return jsonResponse({ error: "Internal server error" }, { status: 500 });
    }
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
