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
