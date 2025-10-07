export type Company = {
  id: string;
  tenantId: string;
  name: string;
  type: "company" | "individual";
  website?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type Meta = {
  sort: string;
  order: string;
  filters: Record<string, string>;
};

export type ListResponse<T> = {
  data: T[];
  pagination: Pagination;
  meta: Meta;
};

export type SingleResponse<T> = {
  data?: T;
};
