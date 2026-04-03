export type ServiceItemKind = "service" | "product";
export type ServiceBillingMethod = "fixed" | "hourly" | "usage";

export type AlgaService = {
  serviceId: string;
  serviceName: string;
  itemKind: ServiceItemKind;
  billingMethod: ServiceBillingMethod;
  serviceTypeId?: string | null;
  serviceTypeName?: string | null;
  defaultRate: number;
  unitOfMeasure: string;
  isActive: boolean;
  sku?: string | null;
};

export type ServicesResponse = {
  items: AlgaService[];
  totalCount: number;
  page: number;
  pageSize: number;
};
