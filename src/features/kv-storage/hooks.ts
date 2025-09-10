import { useContext } from "react";
import { KVStorageContext } from "./context";
import { KVStorage } from "@lib/alga";

export const useKVStorage = (namespace: string) => {
  const context = useContext(KVStorageContext);
  if (!context) {
    throw new Error("useKVStorage must be used within a KVStorageProvider");
  }
  return {
    set: (key: string, value: any) =>
      context.storage.set(`${namespace}:${key}`, value),
    get: (key: string) => context.storage.get(`${namespace}:${key}`),
    remove: (key: string) => context.storage.remove(`${namespace}:${key}`),
    has: (key: string) => context.storage.has(`${namespace}:${key}`),
  } as KVStorage;
};
