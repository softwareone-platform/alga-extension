export type PlanService = "payg";
export type Operations = "self-service" | "managed";
export type BillingConfigStatus = "active" | "unconfigured";

export type BillingConfig = {
  id: string;
  agreementId: string;
  status: BillingConfigStatus;
  consumerId: string;
  planService: PlanService;
  operations: Operations;
  markup: number;
  note?: string;
  updatedAt?: string;
};
