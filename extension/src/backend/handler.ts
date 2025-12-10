import "./polyfill";

// WIT imports - these are the actual runtime bindings
import { logInfo, logError } from "alga:extension/logging";
import { get as getSecret } from "alga:extension/secrets";
import { fetch as httpFetch } from "alga:extension/http";

import {
  type ExecuteRequest,
  type ExecuteResponse,
} from "@alga-psa/extension-runtime";
import type { HttpHeader, HttpRequest } from "alga:extension/http";

import { filters, type UserType } from "./filters";
import { filterResponse, getRule } from "./filter";

const decoder = new TextDecoder();
const encoder = new TextEncoder();

// Inline jsonResponse
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

function decodeBody(body?: Uint8Array | null): string {
  if (!body || body.length === 0) return "";
  return decoder.decode(body);
}

function parseProxyPayload(body?: Uint8Array | null): Record<string, unknown> {
  const text = decodeBody(body);
  if (!text) return {};
  try {
    const value = JSON.parse(text);
    if (typeof value === "object" && value !== null) {
      return value as Record<string, unknown>;
    }
  } catch {
    // Payload parsing errors should not throw
  }
  return {};
}

// Route handlers for proxy calls - no longer need host parameter
// Note: Must be sync because WIT/WASM doesn't support async
type RouteHandler = (
  payload: Record<string, unknown>,
  context: ExecuteRequest["context"]
) => ExecuteResponse;

// SWO API fetch helper - uses WIT imports directly
function fetchSWO(
  baseUrl: string,
  token: string,
  path: string,
  method: "GET" | "POST" = "GET",
  body?: unknown
): { ok: boolean; data: unknown; status: number; error?: string } {
  const url = `${baseUrl}${path}`;
  const headers: HttpHeader[] = [
    { name: "accept", value: "application/json" },
    { name: "content-type", value: "application/json" },
    { name: "authorization", value: `Bearer ${token}` },
  ];

  const request: HttpRequest = {
    method,
    url,
    headers,
    body: body ? encoder.encode(JSON.stringify(body)) : null,
  };

  const response = httpFetch(request);

  const text = decodeBody(response.body);
  if (response.status >= 200 && response.status < 300) {
    try {
      const json = text ? JSON.parse(text) : {};
      return { ok: true, data: json, status: response.status };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, data: null, status: response.status, error: `failed_to_parse_response: ${message}` };
    }
  }
  const errorMessage = text || `upstream returned status ${response.status}`;
  return { ok: false, data: null, status: response.status, error: errorMessage };
}

// Alga API fetch helper - uses WIT imports directly
function fetchAlga(
  baseUrl: string,
  apiKey: string,
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): { ok: boolean; data: unknown; status: number; error?: string } {
  const url = `${baseUrl}${path}`;
  const headers: HttpHeader[] = [
    { name: "accept", value: "application/json" },
    { name: "content-type", value: "application/json" },
    { name: "x-api-key", value: apiKey },
  ];

  const request: HttpRequest = {
    method,
    url,
    headers,
    body: body ? encoder.encode(JSON.stringify(body)) : null,
  };

  const response = httpFetch(request);

  const text = decodeBody(response.body);
  if (response.status >= 200 && response.status < 300) {
    try {
      const json = text ? JSON.parse(text) : {};
      return { ok: true, data: json, status: response.status };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, data: null, status: response.status, error: `failed_to_parse_response: ${message}` };
    }
  }
  const errorMessage = text || `upstream returned status ${response.status}`;
  return { ok: false, data: null, status: response.status, error: errorMessage };
}

// Get credentials from secrets - uses WIT imports directly
function getSWOCredentials(): { baseUrl: string; token: string } {
  const token = getSecret("SWO_API_TOKEN");
  let baseUrl: string;
  try {
    baseUrl = getSecret("SWO_API_BASE_URL");
  } catch {
    baseUrl = "https://portal.s1.live/public/v1";
  }
  return { baseUrl, token };
}

function getAlgaCredentials(): { baseUrl: string; apiKey: string } {
  const apiKey = getSecret("ALGA_API_KEY");
  let baseUrl: string;
  try {
    baseUrl = getSecret("ALGA_API_BASE_URL");
  } catch {
    baseUrl = "https://api.algapsa.com";
  }
  return { baseUrl, apiKey };
}

// Generic SWO route handler with filtering
function handleSWORoute(
  path: string,
  userType: UserType
): ExecuteResponse {
  const rule = getRule(path, userType, filters);
  if (!rule) {
    return jsonResponse({ ok: false, error: `Forbidden: ${path}` }, { status: 403 });
  }

  const { baseUrl, token } = getSWOCredentials();
  const result = fetchSWO(baseUrl, token, path);

  if (!result.ok) {
    return jsonResponse(
      { ok: false, error: result.error, upstreamStatus: result.status },
      { status: 502 }
    );
  }

  const filtered = filterResponse(result.data as any, rule);
  return jsonResponse({ ok: true, data: filtered, upstreamStatus: result.status });
}

// Route definitions - simplified without host parameter
const routes: Record<string, RouteHandler> = {
  // SWO Commerce - Agreements
  "/swo/agreements/list": (payload) => {
    const { query = "" } = payload;
    const path = `/commerce/agreements${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  "/swo/agreements/get": (payload) => {
    const { id, query = "" } = payload;
    if (!id) return jsonResponse({ ok: false, error: "missing id" }, { status: 400 });
    const path = `/commerce/agreements/${id}${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  // SWO Commerce - Orders
  "/swo/orders/list": (payload) => {
    const { query = "" } = payload;
    const path = `/commerce/orders${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  "/swo/orders/get": (payload) => {
    const { id, query = "" } = payload;
    if (!id) return jsonResponse({ ok: false, error: "missing id" }, { status: 400 });
    const path = `/commerce/orders/${id}${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  "/swo/orders/create": (payload) => {
    const { body } = payload;
    if (!body) return jsonResponse({ ok: false, error: "missing body" }, { status: 400 });
    const { baseUrl, token } = getSWOCredentials();
    const result = fetchSWO(baseUrl, token, "/commerce/orders", "POST", body);
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: result.data, upstreamStatus: result.status });
  },

  "/swo/orders/process": (payload) => {
    const { id, body } = payload;
    if (!id) return jsonResponse({ ok: false, error: "missing id" }, { status: 400 });
    const { baseUrl, token } = getSWOCredentials();
    const result = fetchSWO(baseUrl, token, `/commerce/orders/${id}/process`, "POST", body);
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: result.data, upstreamStatus: result.status });
  },

  // SWO Commerce - Subscriptions
  "/swo/subscriptions/list": (payload) => {
    const { query = "" } = payload;
    const path = `/commerce/subscriptions${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  "/swo/subscriptions/get": (payload) => {
    const { id, query = "" } = payload;
    if (!id) return jsonResponse({ ok: false, error: "missing id" }, { status: 400 });
    const path = `/commerce/subscriptions/${id}${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  // SWO Billing - Statements
  "/swo/statements/list": (payload) => {
    const { query = "" } = payload;
    const path = `/billing/statements${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  "/swo/statements/get": (payload) => {
    const { id, query = "" } = payload;
    if (!id) return jsonResponse({ ok: false, error: "missing id" }, { status: 400 });
    const path = `/billing/statements/${id}${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  "/swo/statements/charges": (payload) => {
    const { statementId, query = "" } = payload;
    if (!statementId) return jsonResponse({ ok: false, error: "missing statementId" }, { status: 400 });
    const path = `/billing/statements/${statementId}/charges${query ? `?${query}` : ""}`;
    return handleSWORoute(path, "msp");
  },

  // SWO Accounts
  "/swo/accounts/get": () => {
    const path = "/accounts/accounts";
    return handleSWORoute(path, "msp");
  },

  "/swo/users/get": () => {
    const path = "/accounts/users";
    return handleSWORoute(path, "msp");
  },

  // Alga API - KV Storage
  "/alga/storage/get": () => {
    return jsonResponse({ ok: true, data: {}, upstreamStatus: 200 });
  },

  "/alga/storage/set": (payload) => {
    const { namespace, key, value, metadata, ttlSeconds } = payload;
    if (!namespace || !key) return jsonResponse({ ok: false, error: "missing namespace or key" }, { status: 400 });
    const { baseUrl, apiKey } = getAlgaCredentials();
    const path = `/api/v1/storage/namespaces/${namespace}/records/${encodeURIComponent(key as string)}`;
    const body = { value, metadata: metadata ?? { contentType: "application/json" }, ttlSeconds };
    const result = fetchAlga(baseUrl, apiKey, path, "PUT", body);
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: result.data, upstreamStatus: result.status });
  },

  "/alga/storage/delete": (payload) => {
    const { namespace, key } = payload;
    if (!namespace || !key) return jsonResponse({ ok: false, error: "missing namespace or key" }, { status: 400 });
    const { baseUrl, apiKey } = getAlgaCredentials();
    const path = `/api/v1/storage/namespaces/${namespace}/records/${encodeURIComponent(key as string)}`;
    const result = fetchAlga(baseUrl, apiKey, path, "DELETE");
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: null, upstreamStatus: result.status });
  },

  "/alga/storage/list": (payload) => {
    const { namespace, limit, cursor, keyPrefix } = payload;
    if (!namespace) return jsonResponse({ ok: false, error: "missing namespace" }, { status: 400 });
    const { baseUrl, apiKey } = getAlgaCredentials();
    const params = new URLSearchParams();
    if (limit !== undefined) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor as string);
    if (keyPrefix) params.set("keyPrefix", keyPrefix as string);
    params.set("includeValues", "true");
    const query = params.toString() ? `?${params.toString()}` : "";
    const path = `/api/v1/storage/namespaces/${namespace}/records${query}`;
    const result = fetchAlga(baseUrl, apiKey, path, "GET");
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: result.data, upstreamStatus: result.status });
  },

  // Alga API - Clients
  "/alga/clients/list": () => {
    const { baseUrl, apiKey } = getAlgaCredentials();
    const result = fetchAlga(baseUrl, apiKey, "/api/v1/clients/", "GET");
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: result.data, upstreamStatus: result.status });
  },

  "/alga/clients/get": (payload) => {
    const { id } = payload;
    if (!id) return jsonResponse({ ok: false, error: "missing id" }, { status: 400 });
    const { baseUrl, apiKey } = getAlgaCredentials();
    const result = fetchAlga(baseUrl, apiKey, `/api/v1/clients/${id}`, "GET");
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: result.data, upstreamStatus: result.status });
  },

  // Alga API - Services
  "/alga/services/list": () => {
    const { baseUrl, apiKey } = getAlgaCredentials();
    const result = fetchAlga(baseUrl, apiKey, "/api/v1/services/", "GET");
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: result.data, upstreamStatus: result.status });
  },

  "/alga/services/get": (payload) => {
    const { id } = payload;
    if (!id) return jsonResponse({ ok: false, error: "missing id" }, { status: 400 });
    const { baseUrl, apiKey } = getAlgaCredentials();
    const result = fetchAlga(baseUrl, apiKey, `/api/v1/services/${id}`, "GET");
    if (!result.ok) {
      return jsonResponse({ ok: false, error: result.error, upstreamStatus: result.status }, { status: 502 });
    }
    return jsonResponse({ ok: true, data: result.data, upstreamStatus: result.status });
  },
};

// Handler now only takes request - host bindings are accessed via imports
export function handler(
  request: ExecuteRequest
): ExecuteResponse {
  const url = request.http.url ?? "/";

  // Routes can come with or without /proxy/ prefix
  // /proxy/swo/agreements/list -> /swo/agreements/list
  // /swo/agreements/list -> /swo/agreements/list
  const route = url.startsWith("/proxy/") ? url.replace(/^\/proxy/, "") : url;

  logInfo(`[handler] Request: url=${url}, route=${route}`);

  const routeHandler = routes[route];
  if (!routeHandler) {
    // Return a simple ready response for unknown routes (like root path)
    logInfo(`[handler] No handler for route, returning ready response`);
    return jsonResponse({ message: "Extension handler ready", route }, { status: 200 });
  }

  const payload = parseProxyPayload(request.http.body);

  try {
    // Route handlers are sync (WIT imports are sync)
    return routeHandler(payload, request.context);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logError(`[handler] Route error: ${route} - ${message}`);
    return jsonResponse({ ok: false, error: message }, { status: 500 });
  }
}
