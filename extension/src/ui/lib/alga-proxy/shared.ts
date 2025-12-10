import type { UiProxyHost } from "@lib/proxy";

export type ProxyClientConfig = {
  uiProxy: UiProxyHost;
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
