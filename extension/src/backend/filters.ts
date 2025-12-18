import type { Filters } from "./filter";

export const filters: Filters = {
  msp: {
    allowed: [
      { path: "/commerce/agreements" },
      { path: "/commerce/orders" },
      { path: "/commerce/subscriptions" },
      { path: "/billing/statements" },
      { path: "/accounts/accounts" },
      { path: "/accounts/users" },
    ],
  },
  customer: {
    allowed: [
      { path: "/commerce/agreements" },
      { path: "/commerce/orders" },
      { path: "/commerce/subscriptions" },
      { path: "/billing/statements" },
    ],
  },
};
