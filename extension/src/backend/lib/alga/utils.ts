import { ExecuteResponse } from "@alga-psa/extension-runtime";
import { encode } from "../utils";

export function jsonResponse(
  body: unknown,
  init: Partial<ExecuteResponse> = {}
): ExecuteResponse {
  return {
    status: init.status ?? 200,
    headers: init.headers ?? [
      { name: "content-type", value: "application/json" },
    ],
    body: encode(body),
  };
}
