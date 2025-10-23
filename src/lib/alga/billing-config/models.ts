export type Operations = "self-service" | "managed";
export type BillingConfigStatus = "active" | "unconfigured";

export type BillingConfigConsumer = {
  id: string;
  name: string;
};

export type BillingConfig = {
  id: string;
  agreementId: string;
  status: BillingConfigStatus;
  consumer?: BillingConfigConsumer;
  serviceId?: string;
  operations: Operations;
  markup: number;
  note?: string;
  audit: {
    createdAt: string;
    updatedAt?: string;
  };
};
