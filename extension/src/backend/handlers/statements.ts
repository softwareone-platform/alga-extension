import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "../lib";
import { extension, StatementService } from "../features";
import { SWOClient } from "../lib/swo/client";
import { ListOptions, optionsFromUrl } from "@/shared/list-options";
import { ExtensionDetails } from "@/shared/extension-details";

export const statementsHandler = ({
  http: { method, url },
}: ExecuteRequest): ExecuteResponse => {
  const { token, endpoint, status } = extension.getDetails();
  if (status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 422 });
  }

  if (method === "GET") {
    const [path] = url.split("?");
    const id = path.split("/")[2];

    const swoClient = new SWOClient(endpoint, token);
    const statementService = new StatementService(swoClient);

    if (id) {
      const data = statementService.getById(id);
      return jsonResponse(data, { status: 200 });
    }

    const options = optionsFromUrl(url);
    const data = statementService.list(options);

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

export const getById = (id: string, extensionDetails: ExtensionDetails) => {
  const { token, endpoint } = extensionDetails;
  const swoClient = new SWOClient(endpoint, token);
  const statementService = new StatementService(swoClient);
  return statementService.getById(id);
};

export const list = (
  options: ListOptions,
  extensionDetails: ExtensionDetails,
) => {
  const { token, endpoint } = extensionDetails;
  const swoClient = new SWOClient(endpoint, token);
  const statementService = new StatementService(swoClient);
  return statementService.list(options);
};

export const invoiceStatement = (
  id: string,
  extensionDetails: ExtensionDetails,
) => {
  const { token, endpoint } = extensionDetails;
  const swoClient = new SWOClient(endpoint, token);
  const statementService = new StatementService(swoClient);
  return statementService.invoiceStatement(id);
};
