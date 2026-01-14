import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "../lib";
import { StatementListResponse } from "@swo/mp-api-model/billing";
import { extension, statements } from "../features";
import { SWOClient } from "../lib/swo/client";

export const statementsHandler = ({
  http: { method, url },
}: ExecuteRequest): ExecuteResponse => {
  const { token, endpoint, status } = extension.getDetails();
  if (status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 422 });
  }

  if (method === "GET") {
    const [urlWithPath, rql] = url.split("?");

    const swoClient = new SWOClient(endpoint, token);

    const statementsPath = urlWithPath.split("/").slice(7).join("/");
    const path = statementsPath
      ? `/billing/statements/${statementsPath}`
      : "/billing/statements";

    const { data: swoData, $meta } = swoClient.fetch<StatementListResponse>(
      path,
      rql
    );

    const data = statements.get(swoData || []);

    return jsonResponse(
      {
        data,
        $meta,
      },
      { status: 200 }
    );
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
