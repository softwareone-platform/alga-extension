import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { fetch as httpFetch } from "alga:extension/http";
import {
  Filters,
  UserType,
  filterResponse,
  getRule,
  extension,
} from "../features";

import { decode, jsonResponse } from "../lib";
import { logInfo } from "alga:extension/logging";
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
  const { token, endpoint, status } = extension.getDetails();

  if (status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 422 });
  }

  const path = request.http.url.replace("/swo", "");

  const rule = getRule(path, userType as UserType, filters);

  if (!rule)
    return jsonResponse(
      { error: "Extension is not configured" },
      { status: 422 }
    );

  const response = httpFetch({
    method: request.http.method,
    url: `${endpoint}${path}`,
    headers: [
      { name: "Authorization", value: `Bearer ${token}` },
      { name: "Content-Type", value: "application/json" },
    ],
  });

  const location = response.headers.find((h) => h.name === "Location")?.value;
  const headers = location ? [{ name: "Location", value: location }] : [];

  const responseBody = decode(response.body);

  logInfo(`Response from: ${endpoint}${path}`);
  logInfo(`Response headers: ${JSON.stringify(response.headers)}`);
  logInfo(`Response status: ${response.status}`);
  logInfo(`Response body: ${responseBody}`);

  if (!responseBody)
    return jsonResponse({}, { status: response.status, headers });

  const body = filterResponse(responseBody, rule);
  return jsonResponse(body, { status: response.status, headers });
};
