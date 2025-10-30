export type Operations = "self-service" | "managed";
export type BillingConfigStatus = "active" | "unconfigured";

export type BillingConfigConsumer = {
  id: string;
  name: string;
};

export type BillingConfigService = {
  id: string;
  name: string;
};

export type BillingConfig = {
  id: string;
  agreementId: string;
  status: BillingConfigStatus;
  consumer?: BillingConfigConsumer;
  service?: BillingConfigService;
  operations: Operations;
  markup: number;
  note?: string;
  audit: {
    createdAt: string;
    updatedAt?: string;
  };
};
