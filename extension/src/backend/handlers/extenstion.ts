import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";

import { jsonResponse } from "../utils";

export const extensionHandler = (request: ExecuteRequest): ExecuteResponse => {
  // const userType: UserType = "msp";

  if (request.http.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  return jsonResponse(
    {
      endpoint: "https://portal.s1.live/public/v1",
      token:
        "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR",
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
