import axios from "axios";

export const axiosInstance = (baseUrl: string, apiKey: string) =>
  axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  });

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
