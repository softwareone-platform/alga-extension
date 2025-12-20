export type Operations = "self-service" | "managed";
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
