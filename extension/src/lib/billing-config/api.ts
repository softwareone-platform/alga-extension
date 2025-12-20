import { BillingConfig } from "./model";

export type BillingConfigChanges = Omit<
  BillingConfig,
  "audit" | "status" | "id"
>;

export type BillingConfigsRequestBody = BillingConfigChanges[];

export type BillingConfigsResponseBody = BillingConfig[];
