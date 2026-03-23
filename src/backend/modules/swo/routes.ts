import { fetch as httpFetch } from "alga:extension/http";
import { Filters, UserType, getRule } from "./filters";
import { decode, encode, jsonResponse } from "@/backend/lib";
import { route } from "@/backend/routing";

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

route(
  "*",
  "/swo/:swoPath(.*)",
  ({ url, user, method, body, extensionDetails: { endpoint, token } }) => {
    const swoUrl = url.replace("/swo", "");
    const rule = getRule(swoUrl, user?.userType as UserType, filters);
    if (!rule)
      return jsonResponse(
        { error: "Extension is not configured" },
        { status: 422 },
      );

    const response = httpFetch({
      method,
      url: `${endpoint}${swoUrl}`,
      headers: [
        { name: "Authorization", value: `Bearer ${token}` },
        { name: "Content-Type", value: "application/json" },
      ],
      body: body ? encode(body) : undefined,
    });

    const location = response.headers.find((h) => h.name === "Location")?.value;
    const headers = location ? [{ name: "Location", value: location }] : [];

    const responseBody = decode(response.body);

    return { status: response.status, headers, body: responseBody || {} };
  },
);
