import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "../lib";
import { StatementListResponse } from "@swo/mp-api-model/billing";
import { extension } from "../features";
import { SWOClient } from "../lib/swo/client";

export const statementsHandler = ({
  http: { method, url },
}: ExecuteRequest): ExecuteResponse => {
  const { token, endpoint, status } = extension.getDetails();
  if (status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 422 });
  }

  if (method === "GET") {
    const rql = url.split("?")[1];

    const swoClient = new SWOClient(endpoint, token);
    const { data, $meta } = swoClient.fetch<StatementListResponse>(
      `/billing/statements`,
      rql
    );

    console.log(data);

    return jsonResponse(
      {
        data,
        $meta,
        url: `${endpoint}/billing/statements?${rql}`,
      },
      { status: 200 }
    );
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
