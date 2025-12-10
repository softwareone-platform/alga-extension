import type { UiProxyHost } from "@lib/proxy";

export type ListOptions<T> = {
  offset?: number;
  limit?: number;
  sort?: {
    by: keyof T;
    order: "asc" | "desc";
  };
};

export type ProxyClientConfig = {
  uiProxy: UiProxyHost;
};
