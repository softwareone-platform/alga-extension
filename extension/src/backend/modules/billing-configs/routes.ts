import {
  BillingConfigsRequestBody,
  BillingConfigsResponseBody,
} from "@/shared/billing-configs";
import { billingConfigs } from "./billing-configs";
import { route } from "@/backend/routing";

route<unknown, BillingConfigsResponseBody>(
  "GET",
  "/billing-configs",
  ({ user }) => {
    if (!user?.userType) {
      return { status: 403, error: "Unauthorized" };
    }

    const all = billingConfigs.getConfigs();

    if (user?.userType === "internal")
      return {
        status: 200,
        body: all,
      };

    return {
      status: 200,
      body: all.filter((v) => v.consumerId === user.clientId),
    };
  },
);

route<BillingConfigsRequestBody, BillingConfigsResponseBody>(
  "POST",
  "/billing-configs",
  ({ body: changes, user }) => {
    if (user?.userType !== "internal") {
      return { status: 403, error: "Unauthorized" };
    }

    if (!changes || !Array.isArray(changes)) {
      return { status: 400, error: "Invalid request body, expected array" };
    }

    return {
      status: 202,
      body: billingConfigs.saveConfigs(changes),
    };
  },
);
