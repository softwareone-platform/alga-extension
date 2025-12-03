import type {
  ExecuteRequest,
  ExecuteResponse,
  HostBindings,
} from "@alga-psa/extension-runtime";
import { proxySWO } from "./swo";

// Inline jsonResponse to avoid external dependency for jco componentize
const encoder = new TextEncoder();
function jsonResponse(
  body: unknown,
  init: Partial<ExecuteResponse> = {}
): ExecuteResponse {
  const encoded =
    body instanceof Uint8Array ? body : encoder.encode(JSON.stringify(body));
  return {
    status: init.status ?? 200,
    headers: init.headers ?? [
      { name: "content-type", value: "application/json" },
    ],
    body: encoded,
  };
}

export async function handler(
  request: ExecuteRequest,
  _: HostBindings
): Promise<ExecuteResponse> {
  // const secret = await host.secrets.list();
  // const path = new URL(request.http.url).pathname;

  const response = await proxySWO<unknown>(request.http.url);

  return jsonResponse({ response }, { status: 200 });
}
