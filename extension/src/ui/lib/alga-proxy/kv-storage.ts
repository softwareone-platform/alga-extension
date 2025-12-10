import { callProxy, callProxyJson, type UiProxyHost } from "@lib/proxy";

export type KVStorageObject<T> = {
  value: T;
  createdAt: string;
  updatedAt: string;
};

type StorageGetResponse = {
  namespace: string;
  key: string;
  revision: number;
  value: unknown;
  metadata: Record<string, unknown>;
  ttlExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type StoragePutResponse = {
  namespace: string;
  key: string;
  revision: number;
  ttlExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type StorageListResponse = {
  items: Array<{
    namespace: string;
    key: string;
    revision: number;
    value?: unknown;
    metadata?: Record<string, unknown>;
    ttlExpiresAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  nextCursor: string | null;
};

export class KVStorage {
  private namespace: string;
  private uiProxy: UiProxyHost;

  constructor(uiProxy: UiProxyHost, namespace: string) {
    this.uiProxy = uiProxy;
    this.namespace = namespace;
  }

  async set<T>(key: string, value: T): Promise<KVStorageObject<T>> {
    const response = await callProxy<StoragePutResponse>(
      this.uiProxy,
      "/alga/storage/set",
      {
        namespace: this.namespace,
        key,
        value,
        metadata: { contentType: "application/json" },
      }
    );
    return {
      value,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  async get<T>(key: string): Promise<KVStorageObject<T> | null> {
    const response = await callProxyJson<StorageGetResponse | null>(
      this.uiProxy,
      "/alga/storage/get",
      {
        namespace: this.namespace,
        key,
      }
    );

    // Handle 404 case - data will be null
    if (!response.ok || !response.data) {
      return null;
    }

    const data = response.data;
    return {
      value: data.value as T,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async remove(key: string): Promise<void> {
    await callProxy(this.uiProxy, "/alga/storage/delete", {
      namespace: this.namespace,
      key,
    });
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
    const response = await callProxy<StorageListResponse>(
      this.uiProxy,
      "/alga/storage/list",
      {
        namespace: this.namespace,
        limit,
        cursor,
        keyPrefix,
      }
    );

    return response.items.map((item) => ({
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
