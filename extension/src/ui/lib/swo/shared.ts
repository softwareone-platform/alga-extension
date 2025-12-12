export type ListOptions<T> = {
  offset?: number;
  limit?: number;
  sort?: {
    by: keyof T;
    order: "asc" | "desc";
  };
};
