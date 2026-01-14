import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";

import { jsonResponse } from "../lib/alga";
import { decode } from "../lib";
import {
  ExtensionDetailsRequestBody,
  ExtensionDetailsResponseBody,
} from "@/shared/extension-details";
import { extension } from "../features";

export const extensionHandler = ({
  http: { method, body },
}: ExecuteRequest): ExecuteResponse => {
  if (method === "GET") {
    const { token, ...rest } = extension.getDetails();
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
    const { token, ...rest } = extension.saveDetails(change);
    const response: ExtensionDetailsResponseBody = {
      ...rest,
      hasToken: !!token,
    };
    return jsonResponse(response, { status: 202 });
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
