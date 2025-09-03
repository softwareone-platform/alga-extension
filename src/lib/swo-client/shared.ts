import axios from "axios";

export type ListOptions<T> = {
  offset?: number;
  limit?: number;
  sort?: {
    by: keyof T;
    order: "asc" | "desc";
  };
};

export const axiosInstance = (baseUrl: string, token: string) =>
  axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
