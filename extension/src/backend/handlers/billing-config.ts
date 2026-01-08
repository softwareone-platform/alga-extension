import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { logError, logInfo, logWarn } from "alga:extension/logging";
import { decode, jsonResponse } from "../utils";
import { BillingConfigsService } from "../services/billing-configs";

export const billingConfigHandler = (
  request: ExecuteRequest
): ExecuteResponse => {
  const method = request.http.method;

  const billingConfigsService = new BillingConfigsService();

  if (method === "GET") {
    logInfo(`Getting billing configs...`);
    const configs = billingConfigsService.getConfigs();
    return jsonResponse(configs, { status: 200 });
  }

  if (method === "POST") {
    logInfo(`Saving billing configs...`);
    try {
      const changes = decode(request.http.body) || [];

      if (!Array.isArray(changes)) {
        logWarn(`Invalid request body, expected array`);
        return jsonResponse(
          { error: "Invalid request body, expected array" },
          { status: 400 }
        );
      }

      const newConfigs = billingConfigsService.saveConfigs(changes);
      return jsonResponse(newConfigs, { status: 200 });
    } catch (error) {
      logError(`Error handling POST request: ${error}`);
      return jsonResponse({ error: "Internal server error" }, { status: 500 });
    }
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
