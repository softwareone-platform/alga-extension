import { ExtensionDetails } from "@/shared/extension-details";
import {
  ExecuteRequest,
  HttpHeader,
  jsonResponse,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { match, MatchFunction } from "path-to-regexp";
import { decode } from "./lib";
import { getUser, UserData } from "alga:extension/user-v2";
import { extension } from "./extension";

export type HandlerRequest<T> = {
  extensionDetails: ExtensionDetails;
  headers: HttpHeader[];
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  params: Record<string, any>;
  url: string;
  body?: T;
  user?: UserData;
};

export type HandlerResponse<T> = {
  status: number;
  body?: T;
  error?: string;
  headers?: HttpHeader[];
};

export type Handler<TRequest, TResponse> = (
  request: HandlerRequest<TRequest>,
) => HandlerResponse<TResponse>;

export type HandlerMethod =
  | "*"
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

const hs = new Array<{
  method: HandlerMethod | HandlerMethod[];
  path: string;
  matcher: MatchFunction;
  handler: Handler<any, any>;
  requiresActive: boolean;
}>();

export const defineHandler = <TRequest = unknown, TResponse = unknown>(
  method: HandlerMethod | HandlerMethod[],
  path: string,
  handler: Handler<TRequest, TResponse>,
  requiresActive: boolean = true,
) => hs.push({ method, path, matcher: match(path), handler, requiresActive });

export const handleRequest = ({
  http: { method, url, headers, body: requestBody },
}: ExecuteRequest): ExecuteResponse => {
  for (const h of hs) {
    const m = h.matcher(url);
    if (!m) continue;
    if (Array.isArray(h.method) && !h.method.includes(method as HandlerMethod))
      continue;
    if (h.method !== "*" && h.method !== method) continue;

    const extensionDetails = extension.getDetails();

    if (h.requiresActive && extensionDetails.status !== "active") {
      return jsonResponse(
        { error: "Extension is not active" },
        { status: 422 },
      );
    }

    const body = requestBody ? decode(requestBody) : undefined;
    const user = getUser();

    const response = h.handler({
      method: method as any,
      url,
      params: m.params,
      headers,
      body,
      extensionDetails,
      user,
    });

    if (response.error) {
      return jsonResponse(
        { error: response.error },
        { status: response.status },
      );
    }

    return jsonResponse(response.body, { status: response.status });
  }

  return jsonResponse({ error: "Not found" }, { status: 404 });
};
