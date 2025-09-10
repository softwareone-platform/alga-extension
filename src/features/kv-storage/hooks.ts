import { useContext } from "react";
import { KVStorageContext } from "./context";

export const useKVStorage = () => {
  const context = useContext(KVStorageContext);
  if (!context) {
    throw new Error("useKVStorage must be used within a KVStorageProvider");
  }
  return context.storage;
};