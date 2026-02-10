import { ListMetadata } from "@swo/mp-api-model";

export type ListOptions = {
  offset?: number;
  limit?: number;
  sort?: {
    by: string;
    order: "asc" | "desc";
  };
};

export const optionsToUrl = (options: ListOptions): string => {
  const {
    offset = 0,
    limit = 100,
    sort = { by: "audit.created.at", order: "desc" },
  } = options || {};

  return `offset=${offset}&limit=${limit}&order=${sort.order === "asc" ? "" : "-"}${sort.by}`;
};

export const optionsFromUrl = (url: string): ListOptions => {
  const offset = url.match(/[?&]offset=(\d+)/)?.[1];
  const limit = url.match(/[?&]limit=(\d+)/)?.[1];

  return {
    offset: offset ? parseInt(offset) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  };
};

export type ListResponse<T> = {
  data: T[];
  $meta: ListMetadata;
};
