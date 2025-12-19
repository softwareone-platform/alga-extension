import { BillingConfig } from "./model";

export type BillingConfigRequestBody = Omit<
  BillingConfig,
  "audit" | "status" | "id"
>;

export type BillingConfigResponseBody = BillingConfig;
