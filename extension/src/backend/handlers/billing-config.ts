import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { logError, logWarn } from "alga:extension/logging";
import { decode, jsonResponse } from "../lib/alga/utils";
import { BillingConfigsService } from "../services/billing-configs";
import { StorageClient } from "../lib/alga";

export const billingConfigHandler = ({
  http: { method, body },
}: ExecuteRequest): ExecuteResponse => {
  const storage = new StorageClient("swo.billing-configs");
  const billingConfigsService = new BillingConfigsService(storage);

  if (method === "GET") {
    const configs = billingConfigsService.getConfigs();
    return jsonResponse(configs, { status: 200 });
  }

  if (method === "POST") {
    try {
      const changes = decode(body) || [];

      if (!Array.isArray(changes)) {
        logWarn(`Invalid request body, expected array`);
        return jsonResponse(
          { error: "Invalid request body, expected array" },
          { status: 400 }
        );
      }

      const newConfigs = billingConfigsService.saveConfigs(changes);
      return jsonResponse(newConfigs, { status: 202 });
    } catch (error) {
      logError(`Error handling POST request: ${error}`);
      return jsonResponse({ error: "Internal server error" }, { status: 500 });
    }
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
