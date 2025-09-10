export type PlanService = "payg";
export type Operations = "self-service" | "managed";

export type Agreement = {
  id: string;
  consumerId: string;
  planService: PlanService;
  markup: number;
  operations: Operations;
  note: string;
};
