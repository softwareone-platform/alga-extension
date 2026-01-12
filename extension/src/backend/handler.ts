import "./polyfill";

import { logError } from "alga:extension/logging";
// import {
//   swoHandler,
//   extensionHandler,
//   billingConfigsHandler,
//   userHandler,
//   statementsHandler,
// } from "./handlers";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { encode, jsonResponse } from "./lib/alga/utils";
import { put as putStorage } from "alga:extension/storage";

// const routes = [
//   { path: "/swo", handler: swoHandler },
//   { path: "/extension", handler: extensionHandler },
//   { path: "/billing-configs", handler: billingConfigsHandler },
//   { path: "/statements", handler: statementsHandler },
//   { path: "/user", handler: userHandler },
// ];

export function handler(request: ExecuteRequest): ExecuteResponse {
  try {
    putStorage({
      namespace: "namespace",
      key: "key",
      value: encode({ ok: true }),
    });
  } catch (error) {
    logError(`Error: ${error}`);

    return jsonResponse(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred " + request.http.url,
      },
      { status: 500 }
    );
  }

  return jsonResponse({ ok: true }, { status: 200 });

  // const route = routes.find((route) => request.http.url.startsWith(route.path));

  // if (!route) {
  //   return jsonResponse(
  //     {
  //       error: "Not Found",
  //       message: `Route not found: ${request.http.url}`,
  //     },
  //     { status: 404 }
  //   );
  // }

  // try {
  //   return route.handler(request);
  // } catch (error) {
  //   logError(`Error: ${error}`);

  //   return jsonResponse(
  //     {
  //       error: "Internal Server Error",
  //       message: "An unexpected error occurred",
  //     },
  //     { status: 500 }
  //   );
  // }
}
