import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { logInfo } from "alga:extension/logging";
import { fetch as httpFetch } from "alga:extension/http";
import { get as getStorage } from "alga:extension/storage";

// import { get as getSecret } from "alga:extension/secrets";

import { UserType, filterResponse, getRule } from "./filter";
import { filters } from "./filters";
import { jsonResponse, parseBody } from "./utils";

export const swoHandler = (request: ExecuteRequest): ExecuteResponse => {
  try {
    const extSettings = getStorage("extension", "settings");
    logInfo(`extSettings: ${JSON.stringify(extSettings)}`);
  } catch (error) {
    logInfo(`Error getting extension settings: ${error}`);
  }

  const userType: UserType = "msp";

  const path = request.http.url.replace("/swo", "");

  const rule = getRule(path, userType, filters);

  if (!rule)
    return jsonResponse(
      {
        error: "Forbidden",
        message: `Request not allowed for user type ${userType}: ${request.http.url}`,
      },
      { status: 403 }
    );

  const swoAPIToken =
    "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";

  logInfo(`Requesting: https://portal.s1.live/public/v1${path}`);

  const response = httpFetch({
    method: request.http.method,
    url: `https://portal.s1.live/public/v1${path}`,
    headers: [
      { name: "Authorization", value: `Bearer ${swoAPIToken}` },
      { name: "Content-Type", value: "application/json" },
    ],
  });

  const responseBody = parseBody(response.body);
  if (!responseBody) return jsonResponse({}, { status: response.status });

  const body = filterResponse(responseBody, rule);
  return jsonResponse(body, { status: response.status });
};
