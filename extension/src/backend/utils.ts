import { BillingConfig } from "@/lib/billing-config";
import { ExecuteResponse } from "@alga-psa/extension-runtime";
import { logError } from "alga:extension/logging";
import { get as getStorage } from "alga:extension/storage";

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

export const parseBody = (
  body?: Uint8Array<ArrayBufferLike> | null | undefined
) => {
  if (!body || body.length === 0) return "";

  const text = decoder.decode(body);
  if (!text) return {};
  try {
    const value = JSON.parse(text);
    if (typeof value === "object" && value !== null) return value;
  } catch {
    // Payload parsing errors should not throw
  }
  return {};
};

export const getBillingConfigs = (): BillingConfig[] => {
  try {
    const entry = getStorage("billing-configs", "billing-configs");
    if (entry) {
      return parseBody(entry.value);
    }
    return [];
  } catch (error) {
    logError(`Error getting billing configs: ${error}`);
    return [];
  }
};
