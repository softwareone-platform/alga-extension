import "./polyfill";

import { logError } from "alga:extension/logging";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { encode, jsonResponse } from "./lib/alga/utils";
import { put as putStorage } from "alga:extension/storage";

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
        message: "putStorage failed: " + error,
        requestUrl: request.http.url,
      },
      { status: 500 }
    );
  }

  return jsonResponse({ ok: true }, { status: 200 });
}
