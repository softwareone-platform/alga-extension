import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";

import { decode, jsonResponse } from "../utils";
import { ExtensionService } from "../services/extension";
import {
  ExtensionDetailsRequestBody,
  ExtensionDetailsResponseBody,
} from "@/shared/extension-details";

export const extensionHandler = ({
  http: { method, body },
}: ExecuteRequest): ExecuteResponse => {
  const extensionService = new ExtensionService();

  if (method === "GET") {
    const { token, ...rest } = extensionService.getDetails();
    const response: ExtensionDetailsResponseBody = {
      ...rest,
      hasToken: !!token,
    };
    return jsonResponse(response, {
      status: 200,
    });
  }

  if (method === "POST") {
    const change = decode(body) as ExtensionDetailsRequestBody;
    if (!change) {
      return jsonResponse({ error: "Invalid request body" }, { status: 400 });
    }
    const { token, ...rest } = extensionService.saveDetails(change);
    const response: ExtensionDetailsResponseBody = {
      ...rest,
      hasToken: !!token,
    };
    return jsonResponse(response, { status: 202 });
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
