import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "../lib/alga/utils";
import { StorageClient } from "../lib/alga";
import { BillingConfigsService } from "../features/billing-configs";
import { StatementsService } from "../features/statements";

export const statementsHandler = ({
  http: { method, body, url },
}: ExecuteRequest): ExecuteResponse => {
  const storage = new StorageClient();
  const billingConfigsService = new BillingConfigsService(storage);
  const statementsService = new StatementsService(
    storage,
    billingConfigsService
  );

  if (method === "GET") {
    const configs = billingConfigsService.getConfigs();
    return jsonResponse(configs, { status: 200 });
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
