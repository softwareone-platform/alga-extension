import type { ExecuteResponse, Handler } from "@alga-psa/extension-runtime";

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

export const handler: Handler = async (request, host) => {
  const secret = await host.secrets.get("api_key");
  return jsonResponse({
    message: `Hello, world! ${secret}`,
    tenantId: request.context.tenantId,
  });
};
