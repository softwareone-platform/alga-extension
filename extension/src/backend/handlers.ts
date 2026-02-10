import { ExtensionDetails } from "@/shared/extension-details";
import {
  ExecuteRequest,
  HttpHeader,
  jsonResponse,
} from "@alga-psa/extension-runtime";
import { match, MatchFunction } from "path-to-regexp";
import { decode } from "./lib";
import { extension } from "./features";
import { getUser, UserData } from "alga:extension/user-v2";

export type HandlerRequest = {
  extensionDetails: ExtensionDetails;
  headers: HttpHeader[];
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  params: Record<string, any>;
  url: string;
  body?: any;
  user?: UserData;
};

export type HandlerResponse = {
  status: number;
  body?: any;
};

export type Handler = (request: HandlerRequest) => HandlerResponse;
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
  handler: Handler;
  requiresActive: boolean;
}>();

export const defineHandler = (
  method: HandlerMethod | HandlerMethod[],
  path: string,
  handler: Handler,
  requiresActive: boolean = true,
) => hs.push({ method, path, matcher: match(path), handler, requiresActive });

export const handleRequest = ({
  http: { method, url, headers, body: requestBody },
}: ExecuteRequest) => {
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

    return h.handler({
      method: method as any,
      url,
      params: m.params,
      headers,
      body,
      extensionDetails,
      user,
    });
  }

  return jsonResponse({ error: "Not found" }, { status: 404 });
};
