import { ListMetadata } from "@swo/mp-api-model";

export type ListResponse<T> = {
  data: T[];
  $meta: ListMetadata;
};
