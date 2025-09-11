export type PlanService = "payg";
export type Operations = "self-service" | "managed";

export type Agreement = {
  id: string;
  consumerId: string;
  planService: PlanService;
  operations: Operations;
  price: {
    SPxY: number;
    RPxY: number;
    currency: string;
    markup: number;
  };
  note?: string;
  updatedAt?: string;
};
