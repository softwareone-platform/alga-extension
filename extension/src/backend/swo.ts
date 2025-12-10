import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { logInfo } from "alga:extension/logging";
// import { get as getSecret } from "alga:extension/secrets";
import { fetch as httpFetch } from "alga:extension/http";

import { UserType, filterResponse, getRule } from "./filter";
import { filters } from "./filters";
import { jsonResponse, parseBody } from "./utils";

export const handleSWO = (request: ExecuteRequest): ExecuteResponse => {
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

  logInfo(`https://portal.s1.live/public/v1${path}`);
  logInfo(`rule: ${request.http.method}`);

  const response = httpFetch({
    method: "GET",
    url: `https://portal.s1.live/public/v1${path}`,
    headers: [
      { name: "Authorization", value: `Bearer ${swoAPIToken}` },
      { name: "Content-Type", value: "application/json" },
    ],
  });

  const responseBody = parseBody(response.body);
  logInfo(`responseBody: ${JSON.stringify(responseBody)}`);

  if (!responseBody) {
    return jsonResponse({}, { status: response.status });
  }

  const body = filterResponse(responseBody, rule);

  return jsonResponse(body, { status: response.status });
};
