export type Operations = "self-service" | "visible" | "hidden";
export type BillingConfigStatus = "active" | "unconfigured";

export type BillingConfig = {
  id: string;
  agreementId: string;
  operations: Operations;
  status: BillingConfigStatus;
  consumerId: string;
  serviceId: string;
  markup: number;
  note?: string;
  audit: {
    createdAt: string;
    updatedAt?: string;
  };
};

export type BillingConfigChange = Omit<
  BillingConfig,
  "audit" | "status" | "id"
>;

//API
export type BillingConfigsResponseBody = BillingConfig[];
export type BillingConfigsRequestBody = BillingConfigChange[];
