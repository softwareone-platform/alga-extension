import axios, { AxiosInstance } from "axios";

const API_KEY =
  "200aebbceb58e17579c1da81754116d236d1a14872f34f755694e84d3d044518";

//${namespace}/records

const axiosInstance = (baseURL: string, apiKey: string) =>
  axios.create({
    baseURL: `${baseURL}/api/v1/storage/namespaces/`,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  });

const toBody = (value: unknown) => {
  return {
    value,
    metadata: {
      contentType: "application/json",
    },
    ttlSeconds: undefined,
  };
};

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

  async list({}: {
    limit?: number;
    cursor?: string;
    keyPrefix?: string;
  }): Promise<string[]> {}

  // async has(key: string): Promise<boolean> {}
}

// Types shared with the API response
interface StoragePutResponse {
  namespace: string;
  key: string;
  revision: number;
  ttlExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StorageGetResponse {
  namespace: string;
  key: string;
  revision: number;
  value: JsonValue;
  metadata: Record<string, JsonValue>;
  ttlExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StorageListResponse {
  items: Array<{
    namespace: string;
    key: string;
    revision: number;
    value?: JsonValue;
    metadata?: Record<string, JsonValue>;
    ttlExpiresAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  nextCursor: string | null;
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
