import axios, { AxiosInstance } from "axios";
import { axiosInstance } from "./shared";

export type KVStorageObject<T> = {
  value: T;
  createdAt: string;
  updatedAt: string;
};

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

  constructor(baseUrl: string, apiKey: string, namespace: string) {
    this.axios = axiosInstance(`${baseUrl}/api/v1/storage/namespaces/`, apiKey);
    this.namespace = namespace;
  }

  async set<T>(key: string, value: T): Promise<KVStorageObject<T>> {
    const response = await this.axios.put<StoragePutResponse>(
      `${this.namespace}/records/${encodeURIComponent(key)}`,
      toBody(value)
    );
    return {
      value,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
    };
  }

  async get<T>(key: string): Promise<KVStorageObject<T> | null> {
    try {
      const response = await this.axios.get<StorageGetResponse>(
        `${this.namespace}/records/${encodeURIComponent(key)}`
      );
      return {
        value: response.data.value as T,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
      };
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

  async list<T>({
    limit,
    cursor,
    keyPrefix,
  }: {
    limit?: number;
    cursor?: string;
    keyPrefix?: string;
  }): Promise<KVStorageObject<T>[]> {
    const params = new URLSearchParams();
    if (limit !== undefined) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    if (keyPrefix) params.set("keyPrefix", keyPrefix);
    params.set("includeValues", "true");
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await this.axios.get<StorageListResponse>(
      `${this.namespace}/records${query}`
    );

    return response.data.items.map((item) => ({
      value: item.value as T,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }
}

// Types shared with the API response
type StoragePutResponse = {
  namespace: string;
  key: string;
  revision: number;
  ttlExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type StorageGetResponse = {
  namespace: string;
  key: string;
  revision: number;
  value: JsonValue;
  metadata: Record<string, JsonValue>;
  ttlExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type StorageListResponse = {
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
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
