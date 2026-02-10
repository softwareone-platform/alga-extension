import "./polyfill";

import { logError } from "alga:extension/logging";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "./lib";
import { handleRequest } from "./engine";

import "./modules/swo/swo";
import "./modules/user/routes";
import "./modules/extensions/routes";
import "./modules/billing-configs/routes";
import "./modules/statements/routes";

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
