import { ExecuteResponse } from "@alga-psa/extension-runtime";

const decoder = new TextDecoder();
const encoder = new TextEncoder();

export function jsonResponse(
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

function decodeBody(body?: Uint8Array | null): string {
  if (!body || body.length === 0) return "";
  return decoder.decode(body);
}

export const parseBody = (body?: Uint8Array | null) => {
  const text = decodeBody(body);
  if (!text) return {};
  try {
    const value = JSON.parse(text);
    if (typeof value === "object" && value !== null) return value;
  } catch {
    // Payload parsing errors should not throw
  }
  return {};
};
