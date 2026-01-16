import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "../lib";
import { extension, StatementService } from "../features";
import { SWOClient } from "../lib/swo/client";

export const statementsHandler = ({
  http: { method, url },
}: ExecuteRequest): ExecuteResponse => {
  const { token, endpoint, status } = extension.getDetails();
  if (status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 422 });
  }

  if (method === "GET") {
    const [path, rql] = url.split("?");
    const id = path.split("/")[2];

    const swoClient = new SWOClient(endpoint, token);
    const statementService = new StatementService(swoClient);

    if (id) {
      const data = statementService.getById(id, rql);
      return jsonResponse(data, { status: 200 });
    }

    const data = statementService.getByRQL(rql);
    return jsonResponse(data, { status: 200 });
  }

  if (method === "POST") {
    const path = url.split("?")[0];
    const segments = path.split("/");
    const id = segments[2];
    const action = segments[3];

    if (id && action === "create-invoice") {
      const swoClient = new SWOClient(endpoint, token);
      const statementService = new StatementService(swoClient);
      const data = statementService.invoiceStatement(id);
      return jsonResponse(data, { status: 200 });
    }

    return jsonResponse({ error: "Not found" }, { status: 404 });
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
