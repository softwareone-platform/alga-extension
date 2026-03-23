import "./polyfill";

import { logError } from "alga:extension/logging";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "./lib";
import { handleRequest } from "./routing";

import "./modules/swo";
import "./modules/user";
import "./modules/extensions";
import "./modules/billing-configs";
import "./modules/statements";

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
