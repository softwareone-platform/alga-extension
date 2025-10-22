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

  async set<T>(key: string, value: T): Promise<void> {
    await this.axios.put<StoragePutResponse>(
      `${this.namespace}/records/${encodeURIComponent(key)}`,
      toBody(value)
    );
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const response = await this.axios.get<StorageGetResponse>(
        `${this.namespace}/records/${encodeURIComponent(key)}`
      );
      return response.data.value as T;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    await this.axios.delete(
      `${this.namespace}/records/${encodeURIComponent(key)}`
    );
  }

  async list({
    limit,
    cursor,
    keyPrefix,
  }: {
    limit?: number;
    cursor?: string;
    keyPrefix?: string;
  }): Promise<string[]> {
    const params = new URLSearchParams();
    if (limit !== undefined) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    if (keyPrefix) params.set("keyPrefix", keyPrefix);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await this.axios.get<StorageListResponse>(
      `${this.namespace}/records${query}`
    );

    return response.data.items.map((item) => item.key);
  }

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
