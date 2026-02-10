import { ExtensionDetails } from "@/shared/extension-details";
import {
  ExecuteRequest,
  HttpHeader,
  jsonResponse,
} from "@alga-psa/extension-runtime";
import { match, MatchFunction } from "path-to-regexp";
import { decode } from "./lib";
import { extension } from "./features";

export type HandlerRequest = {
  method: string;
  url: string;
  params: Record<string, any>;
  headers: HttpHeader[];
  body?: any;
  extensionDetails: ExtensionDetails;
};

export type HandlerResponse = {
  status: number;
  body?: any;
};

export type Handler = (request: HandlerRequest) => HandlerResponse;

const hs = new Array<{
  path: string;
  matcher: MatchFunction;
  handler: Handler;
}>();

export const defineHandler = (path: string, handler: Handler) =>
  hs.push({ path, matcher: match(path), handler });

export const handleRequest = ({
  http: { method, url, headers, body: requestBody },
}: ExecuteRequest) => {
  for (const h of hs) {
    const m = h.matcher(url);
    if (!m) continue;

    const body = requestBody ? decode(requestBody) : undefined;
    const extensionDetails = extension.getDetails();

    return h.handler({
      method,
      url,
      params: m.params,
      headers,
      body,
      extensionDetails,
    });
  }

  return jsonResponse({ error: "Not found" }, { status: 404 });
};
