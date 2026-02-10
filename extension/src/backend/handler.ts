import "./polyfill";

import { logError } from "alga:extension/logging";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "./lib";
import { handleRequest } from "./engine";

import "./handlers/swo";
import "./handlers/user";
import "./handlers/extension";
import "./handlers/billing-configs";
import "./handlers/statements";

// const routes = [
//   { path: "/swo", handler: swoHandler },
//   { path: "/extension", handler: extensionHandler },
//   { path: "/billing-configs", handler: billingConfigsHandler },
//   { path: "/statements", handler: statementsHandler },
//   { path: "/user", handler: userHandler },
// ];

export function handler(request: ExecuteRequest): ExecuteResponse {
  try {
    return handleRequest(request);
  } catch (error) {
    logError(`Error while handling request: ${error}`);

    return jsonResponse(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred",
        details: JSON.stringify(error, null, 2),
      },
      { status: 500 },
    );
  }
}
