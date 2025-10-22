import axios, { AxiosInstance } from "axios";

const API_KEY =
  "200aebbceb58e17579c1da81754116d236d1a14872f34f755694e84d3d044518";

const axiosInstance = (baseURL: string, apiKey: string) =>
  axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export class KVStorage {
  private namespace: string;
  private axios: AxiosInstance;

  constructor(baseUrl: string, namespace: string) {
    this.axios = axiosInstance(baseUrl, API_KEY);
    this.namespace = namespace;
  }

  async set<T>(key: string, value: T): Promise<void> {}

  async get<T>(key: string): Promise<T | null> {}

  async remove(key: string): Promise<void> {}

  async list(): Promise<string[]> {}

  // async has(key: string): Promise<boolean> {}
}
