import type { Filters, UserType } from "./filter";

export type { UserType };

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
      {
        path: "/commerce/agreements",
        filteredFields: ["price.SPxM", "seller.address"],
      },
      {
        path: "/commerce/orders",
        filteredFields: ["price.SPxM"],
      },
      { path: "/billing/statements" },
    ],
  },
};
