import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { logError, logWarn } from "alga:extension/logging";
import { decode, jsonResponse } from "../lib/alga";
import { billingConfigs } from "../features";

export const billingConfigsHandler = ({
  http: { method, body },
}: ExecuteRequest): ExecuteResponse => {
  if (method === "GET") {
    const configs = billingConfigs.getConfigs();
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

      const newConfigs = billingConfigs.saveConfigs(changes);
      return jsonResponse(newConfigs, { status: 202 });
    } catch (error) {
      logError(`Error handling POST request: ${error}`);
      return jsonResponse({ error: "Internal server error" }, { status: 500 });
    }
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
