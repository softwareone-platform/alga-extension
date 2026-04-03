export type Consumer = {
  clientId: string;
  clientName: string;
  clientType?: string | null;
  isInactive: boolean;
  defaultCurrencyCode?: string | null;
  accountManagerId?: string | null;
  accountManagerName?: string | null;
  billingEmail?: string | null;
};

export type ConsumersResponse = {
  items: Consumer[];
  totalCount: number;
  page: number;
  pageSize: number;
};
