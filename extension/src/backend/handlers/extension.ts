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
    const details = extensionService.getDetails();
    const { token, ...rest } = details;
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
    const newDetails = extensionService.saveDetails(change);
    return jsonResponse(newDetails, { status: 202 });

    // return jsonResponse(
    //   {
    //     endpoint: "https://portal.s1.live/public/v1",
    //     hasToken: true,
    //     status: "active",
    //     audit: {
    //       createdAt: new Date().toISOString(),
    //       updatedAt: new Date().toISOString(),
    //       activatedAt: new Date().toISOString(),
    //     },
    //   },
    //   { status: 200 }
    // );
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
