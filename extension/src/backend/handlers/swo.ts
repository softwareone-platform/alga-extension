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
} from "../features/filters";

import { decode, jsonResponse } from "../lib/alga/utils";
import { ExtensionService } from "../features/extension";
import { StorageClient, UsersClient } from "../lib/alga";

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
  const extensionService = new ExtensionService(
    new StorageClient("swo.extension")
  );
  const usersClient = new UsersClient();
  const { userType } = usersClient.getUser();
  const { token, endpoint, status } = extensionService.getDetails();

  if (status !== "active") {
    return jsonResponse({ error: "Extension is not active" }, { status: 403 });
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

  const responseBody = decode(response.body);
  if (!responseBody) return jsonResponse({}, { status: response.status });

  const body = filterResponse(responseBody, rule);
  return jsonResponse(body, { status: response.status });
};
