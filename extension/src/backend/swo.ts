import type {
  ExecuteRequest,
  ExecuteResponse,
  HostBindings,
} from "@alga-psa/extension-runtime";

// Inline jsonResponse to avoid external dependency for jco componentize
const encoder = new TextEncoder();
function jsonResponse(
  body: unknown,
  init: Partial<ExecuteResponse> = {},
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
  _: HostBindings,
): Promise<ExecuteResponse> {
  // const secret = await host.secrets.list();
  // const path = new URL(request.http.url).pathname;

  return jsonResponse(
    {
      tenantId: request.context.tenantId,
      url: request.http.url,
      // path,
    },
    { status: 200 },
  );
}
