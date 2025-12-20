export type Operations = "self-service" | "managed";
export type BillingConfigStatus = "active" | "unconfigured";

export type BillingConfig = {
  id: string;
  agreementId: string;
  status: BillingConfigStatus;
  consumerId: string;
  serviceId: string;
  operations: Operations;
  markup: number;
  note?: string;
  audit: {
    createdAt: string;
    updatedAt?: string;
  };
};
