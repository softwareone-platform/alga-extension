import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { decode, jsonResponse } from "../lib/alga/utils";
import { StorageClient } from "../lib/alga";
import { BillingConfigsService } from "../features/billing-configs";
import { StatementsService } from "../features/statements";
import { ExtensionService } from "../features/extension";
import { fetch as httpFetch } from "alga:extension/http";
import { StatementListResponse } from "@swo/mp-api-model/billing";

export const statementsHandler = ({
  http: { method, url },
}: ExecuteRequest): ExecuteResponse => {
  const storage = new StorageClient();
  const extensionService = new ExtensionService(storage);
  const billingConfigsService = new BillingConfigsService(storage);
  const statementsService = new StatementsService(
    storage,
    billingConfigsService
  );

  const { token, endpoint, status } = extensionService.getDetails();
  if (status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 422 });
  }

  if (method === "GET") {
    const rql = url.split("?")[1];

    const response = httpFetch({
      method: "GET",
      url: `${endpoint}/v1/billing/statements?${rql}`,
      headers: [
        { name: "Authorization", value: `Bearer ${token}` },
        { name: "Content-Type", value: "application/json" },
      ],
    });

    const responseBody = decode<StatementListResponse>(response.body);
    if (!responseBody) return jsonResponse({}, { status: response.status });

    const configs = billingConfigsService.getConfigs();
    return jsonResponse(configs, { status: 200 });
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
