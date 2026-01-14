import "./polyfill";

import { logError } from "alga:extension/logging";
import {
  swoHandler,
  extensionHandler,
  billingConfigsHandler,
  userHandler,
  statementsHandler,
} from "./handlers";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "./lib";

const routes = [
  { path: "/swo", handler: swoHandler },
  { path: "/extension", handler: extensionHandler },
  { path: "/billing-configs", handler: billingConfigsHandler },
  { path: "/statements", handler: statementsHandler },
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
    logError(`Error while handling path: ${route.path} - ${error}`);

    return jsonResponse(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
