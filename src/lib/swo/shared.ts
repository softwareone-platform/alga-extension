import axios from "axios";

export type ListOptions<T> = {
  offset?: number;
  limit?: number;
  sort?: {
    by: keyof T;
    order: "asc" | "desc";
  };
};

export const axiosInstance = (baseURL: string, token: string) =>
  axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
