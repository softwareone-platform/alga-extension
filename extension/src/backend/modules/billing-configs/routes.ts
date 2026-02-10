import {
  BillingConfigsRequestBody,
  BillingConfigsResponseBody,
} from "@/shared/billing-configs";
import { billingConfigs } from "./billing-configs";
import { defineHandler } from "@/backend/engine";

defineHandler<unknown, BillingConfigsResponseBody>(
  "GET",
  "/billing-configs",
  () => {
    return {
      status: 200,
      body: billingConfigs.getConfigs(),
    };
  },
);

defineHandler<BillingConfigsRequestBody, BillingConfigsResponseBody>(
  "POST",
  "/billing-configs",
  ({ body: changes }) => {
    if (!changes || !Array.isArray(changes)) {
      return { status: 400, error: "Invalid request body, expected array" };
    }

    return {
      status: 202,
      body: billingConfigs.saveConfigs(changes),
    };
  },
);
