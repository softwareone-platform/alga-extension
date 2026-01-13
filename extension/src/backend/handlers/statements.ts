import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { decode, jsonResponse } from "../lib/alga";
import { fetch as httpFetch } from "alga:extension/http";
import { StatementListResponse } from "@swo/mp-api-model/billing";
import { extension, statements } from "../features";

export const statementsHandler = ({
  http: { method, url },
}: ExecuteRequest): ExecuteResponse => {
  const { token, endpoint, status } = extension.getDetails();
  if (status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 422 });
  }

  if (method === "GET") {
    const rql = url.split("?")[1];

    const swoResponse = httpFetch({
      method: "GET",
      url: `${endpoint}/v1/billing/statements?${rql}`,
      headers: [
        { name: "Authorization", value: `Bearer ${token}` },
        { name: "Content-Type", value: "application/json" },
      ],
    });

    const swoResponseBody = decode<StatementListResponse>(swoResponse.body);
    if (!swoResponseBody)
      return jsonResponse({}, { status: swoResponse.status });

    const data = statements.get(swoResponseBody.data || []);

    return jsonResponse(
      {
        data,
        $meta: swoResponseBody.$meta,
      },
      { status: 200 }
    );
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
