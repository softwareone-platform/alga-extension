import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { logInfo } from "alga:extension/logging";
import { fetch as httpFetch } from "alga:extension/http";
import {
  Filters,
  UserType,
  filterResponse,
  getRule,
} from "../services/filters";

import { decode, jsonResponse } from "../utils";
import { getUser } from "alga:extension/user";

export const filters: Filters = {
  internal: {
    allowed: [
      { path: "/commerce/agreements" },
      { path: "/commerce/orders" },
      { path: "/commerce/subscriptions" },
      { path: "/billing/statements" },
      { path: "/accounts/accounts" },
      { path: "/accounts/users" },
    ],
  },
  client: {
    allowed: [
      { path: "/commerce/agreements" },
      { path: "/commerce/orders" },
      { path: "/commerce/subscriptions" },
      { path: "/billing/statements" },
    ],
  },
};

export const swoHandler = (request: ExecuteRequest): ExecuteResponse => {
  const { userType } = getUser();

  const path = request.http.url.replace("/swo", "");

  const rule = getRule(path, userType as UserType, filters);

  if (!rule)
    return jsonResponse(
      {
        error: "Forbidden",
        message: `Request not allowed for user type ${userType}: ${request.http.url}`,
      },
      { status: 403 }
    );

  const swoAPIToken =
    "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";

  logInfo(`Requesting: https://portal.s1.live/public/v1${path}`);

  const response = httpFetch({
    method: request.http.method,
    url: `https://portal.s1.live/public/v1${path}`,
    headers: [
      { name: "Authorization", value: `Bearer ${swoAPIToken}` },
      { name: "Content-Type", value: "application/json" },
    ],
  });

  const responseBody = decode(response.body);
  if (!responseBody) return jsonResponse({}, { status: response.status });

  const body = filterResponse(responseBody, rule);
  return jsonResponse(body, { status: response.status });
};
