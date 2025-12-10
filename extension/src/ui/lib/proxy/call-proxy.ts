import type { ProxyResponse, UiProxyHost } from "./types";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Call a proxy route with JSON payload and receive JSON response
 */
export async function callProxyJson<T = unknown>(
  uiProxy: UiProxyHost,
  route: string,
  payload?: Record<string, unknown>
): Promise<ProxyResponse<T>> {
  const payloadBytes = payload ? encoder.encode(JSON.stringify(payload)) : undefined;
  const responseBytes = await uiProxy.call(route, payloadBytes);
  const responseText = decoder.decode(responseBytes);

  try {
    return JSON.parse(responseText) as ProxyResponse<T>;
  } catch {
    return {
      ok: false,
      error: `Failed to parse proxy response: ${responseText.slice(0, 100)}`,
    };
  }
}

/**
 * Unwrap a proxy response, throwing if not ok
 */
export function unwrapProxyResponse<T>(response: ProxyResponse<T>): T {
  if (!response.ok) {
    throw new Error(response.error ?? "Proxy call failed");
  }
  return response.data as T;
}

/**
 * Call proxy and unwrap in one step
 */
export async function callProxy<T = unknown>(
  uiProxy: UiProxyHost,
  route: string,
  payload?: Record<string, unknown>
): Promise<T> {
  const response = await callProxyJson<T>(uiProxy, route, payload);
  return unwrapProxyResponse(response);
}
