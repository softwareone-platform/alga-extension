import "./polyfill";

// WIT imports - these are the actual runtime bindings
import { logInfo } from "alga:extension/logging";
import { ExecuteRequest, ExecuteResponse } from "@alga-psa/extension-runtime";
// import { fetch as httpFetch } from "alga:extension/http";

import { jsonResponse, parseBody } from "./utils";

export function handler(request: ExecuteRequest): ExecuteResponse {
  logInfo(`test log!!!!`);

  // const algaApiKey = getSecret("ALGA_API_KEY");
  // const swoApiToken = getSecret("SWO_API_TOKEN");

  const body = parseBody(request.http.body);

  return jsonResponse(
    {
      message: "DONE",
      url: request.http.url,
      body,
      // algaApiKey,
      // swoApiToken,
    },
    { status: 200 }
  );
}
