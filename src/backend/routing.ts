import { ExtensionDetails, ExtensionStatus } from "@/shared/extension-details";
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

export type HandledMethod =
  | "*"
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export type HandledStatus = "*" | ExtensionStatus;

const routes = new Array<{
  method: HandledMethod | HandledMethod[];
  status: HandledStatus;
  path: string;
  matcher: MatchFunction;
  handler: Handler<any, any>;
}>();

export const route = <TRequest = unknown, TResponse = unknown>(
  method: HandledMethod | HandledMethod[],
  path: string,
  handler: Handler<TRequest, TResponse>,
  status: HandledStatus = "active",
) =>
  routes.push({
    method,
    status,
    path,
    matcher: match(path),
    handler,
  });

export const handleRequest = ({
  http: { method, url, headers, body: requestBody },
}: ExecuteRequest): ExecuteResponse => {
  for (const route of routes) {
    const m = route.matcher(url);
    if (!m) continue;
    if (
      Array.isArray(route.method) &&
      !route.method.includes(method as HandledMethod)
    )
      continue;
    if (route.method !== "*" && route.method !== method) continue;

    const extensionDetails = extension.getDetails();

    if (route.status !== "*" && extensionDetails.status !== route.status) {
      return jsonResponse(
        { error: "Extension is not active" },
        { status: 400 },
      );
    }

    const body = requestBody ? decode(requestBody) : undefined;

    // TODO: Temporary fix. getUser will throw an error if the user is not defined
    let user: UserData | undefined;
    try {
      user = getUser();
    } catch {}

    const response = route.handler({
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

  return jsonResponse({ error: "Route not found" }, { status: 404 });
};
