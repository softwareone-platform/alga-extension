export type PlanService = "payg";
export type Operations = "self-service" | "managed";

export type Agreement = {
  id: string;
  consumerId: string;
  planService: PlanService;
  markup: number;
  operations: Operations;
  note?: string;
  RPxY?: number;
};

export const DEFAULT_AGREEMENT: Agreement = {
  id: "",
  consumerId: "",
  planService: "payg",
  markup: 0,
  operations: "self-service",
};
