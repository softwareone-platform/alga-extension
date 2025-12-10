import "./polyfill";

// WIT imports - these are the actual runtime bindings
import { logInfo } from "alga:extension/logging";
// import { get as getSecret } from "alga:extension/secrets";
import { fetch as httpFetch } from "alga:extension/http";
import { ExecuteRequest, ExecuteResponse } from "@alga-psa/extension-runtime";

import { jsonResponse, parseBody } from "./utils";

export function handler(_: ExecuteRequest): ExecuteResponse {
  logInfo(`test log!!!!`);

  const response = httpFetch({
    method: "GET",
    url: "https://google.com",
    headers: [],
  });

  const text = parseBody(response.body);

  return jsonResponse(
    {
      message: "DONE",
      text,
    },
    { status: 200 }
  );
}
