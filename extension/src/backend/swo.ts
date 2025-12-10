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

const toSWOUrl = (baseUrl: string, url: string): string =>
  `${baseUrl}${url.replace("/swo", "")}`;

export const handleSWO = (request: ExecuteRequest): ExecuteResponse => {
  const userType: UserType = "msp";

  const requestPath = new URL(request.http.url, "http://dummy").pathname;
  const rule = getRule(requestPath, userType, filters);

  if (!rule)
    return jsonResponse(
      {
        error: "Forbidden",
        message: `Request not allowed for user type ${userType}: ${requestPath}`,
      },
      { status: 403 }
    );

  const swoAPIUrl = "https://portal.s1.live/public/v1";
  const swoAPIToken =
    "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";

  const url = toSWOUrl(swoAPIUrl, request.http.url);

  const response = httpFetch({
    method: "GET",
    url,
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

  const body = filterResponse(JSON.parse(responseBody), rule);

  return jsonResponse(body, { status: response.status });
};
