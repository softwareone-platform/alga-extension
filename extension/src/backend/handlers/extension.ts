import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";

import { decode, jsonResponse } from "../utils";
import { ExtensionService } from "../services/extension";
import { ExtensionDetailsResponseBody } from "@/shared/extension-details";

export const extensionHandler = ({
  http: { method, body },
}: ExecuteRequest): ExecuteResponse => {
  const extensionService = new ExtensionService();

  if (method === "GET") {
    const details: ExtensionDetailsResponseBody = extensionService.getDetails();
    return jsonResponse(details as ExtensionDetailsResponseBody, {
      status: 200,
    });
  }

  if (method === "POST") {
    const changes = decode(body) || [];
    const newDetails = extensionService.saveDetails(changes);
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
