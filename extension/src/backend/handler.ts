import { logError } from "alga:extension/logging";
import "./polyfill";
import { handleSWO } from "./swo";

// WIT imports - these are the actual runtime bindings
// import { logInfo } from "alga:extension/logging";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "./utils";
// import { fetch as httpFetch } from "alga:extension/http";

// import { jsonResponse, parseBody } from "./utils";

export function handler(request: ExecuteRequest): ExecuteResponse {
  try {
    return handleSWO(request);
  } catch (error) {
    logError(`Error: ${error}`);

    return jsonResponse(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
