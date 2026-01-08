import { logWarn } from "alga:extension/logging";
import { get as getStorage, put as putStorage } from "alga:extension/storage";
import { decode, encode } from "./utils";

export class StorageClient {
  private readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  get<T = unknown>(key: string): T | null {
    try {
      const entry = getStorage(this.namespace, key);
      return decode<T>(entry?.value) ?? null;
    } catch (error) {
      logWarn(`Could not get storage ${this.namespace}:${key}: ${error}`);
      return null;
    }
  }
  put<T = unknown>(key: string, value: T): void {
    putStorage({ namespace: this.namespace, key, value: encode(value) });
  }
}
