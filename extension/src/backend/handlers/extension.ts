import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";

import { jsonResponse } from "../utils";
import { getUser } from "alga:extension/user";

export const extensionHandler = (request: ExecuteRequest): ExecuteResponse => {
  const { userType } = getUser();
  if (userType !== "internal") {
    return jsonResponse({ error: "Forbidden" }, { status: 403 });
  }

  if (request.http.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  return jsonResponse(
    {
      endpoint: "https://portal.s1.live/public/v1",
      hasToken: true,
      status: "active",
      audit: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activatedAt: new Date().toISOString(),
      },
    },
    { status: 200 }
  );
};
