import { logWarn } from "alga:extension/logging";
import { get as getStorage, put as putStorage } from "alga:extension/storage";
import { decode, encode } from "./utils";

export const storage = {
  get: <T = unknown>(namespace: string, key: string): T | null => {
    try {
      const entry = getStorage(namespace, key);
      return decode<T>(entry?.value) ?? null;
    } catch (error) {
      logWarn(`Could not get storage ${namespace}:${key}: ${error}`);
      return null;
    }
  },
  put: <T = unknown>(namespace: string, key: string, value: T): void => {
    putStorage({ namespace, key, value: encode(value) });
  },
};

export type Storage = typeof storage;
