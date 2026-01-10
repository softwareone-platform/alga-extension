import "./polyfill";

import { logError } from "alga:extension/logging";
import {
  swoHandler,
  extensionHandler,
  billingConfigHandler,
  userHandler,
} from "./handlers";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "./lib/alga/utils";

const routes = [
  { path: "/swo", handler: swoHandler },
  { path: "/extension", handler: extensionHandler },
  { path: "/billing-config", handler: billingConfigHandler },
  { path: "/user", handler: userHandler },
];

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
