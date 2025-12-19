import "./polyfill";

import { logError } from "alga:extension/logging";
import { swoHandler } from "./handlers";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "./utils";

const routes = [{ path: "/swo", handler: swoHandler }];

export function handler(request: ExecuteRequest): ExecuteResponse {
  const route = routes.find((route) => request.http.url.startsWith(route.path));

  if (!route) {
    return jsonResponse(
      {
        error: "Not Found",
        message: `Route not found: ${request.http.url}`,
      },
      { status: 404 }
    );
  }

  try {
    return route.handler(request);
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
