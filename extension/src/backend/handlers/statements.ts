import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { match } from "path-to-regexp";
import { jsonResponse } from "../lib";
import { extension, StatementService } from "../features";
import { SWOClient } from "../lib/swo/client";
import { ListOptions, optionsFromUrl } from "@/shared/list-options";
import { ExtensionDetails } from "@/shared/extension-details";

const matchCreateInvoice = match("/statements/:id/create-invoice");
const matchStatementById = match("/statements/:id");
const matchStatementsList = match("/statements");

export const statementsHandler = ({
  http: { method, url },
}: ExecuteRequest): ExecuteResponse => {
  const extensionDetails = extension.getDetails();
  if (extensionDetails.status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 422 });
  }

  const [path] = url.split("?");

  if (method === "POST") {
    const invoiceMatch = matchCreateInvoice(path);
    if (invoiceMatch) {
      const { id } = invoiceMatch.params as { id: string };
      const data = invoiceStatement(id, extensionDetails);
      return jsonResponse(data, { status: 200 });
    }

    return jsonResponse({ error: "Not found" }, { status: 404 });
  }

  if (method === "GET") {
    const byIdMatch = matchStatementById(path);
    if (byIdMatch) {
      const { id } = byIdMatch.params as { id: string };
      const data = getById(id, extensionDetails);
      return jsonResponse(data, { status: 200 });
    }

    const listMatch = matchStatementsList(path);
    if (listMatch) {
      const options = optionsFromUrl(url);
      const data = list(options, extensionDetails);
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
