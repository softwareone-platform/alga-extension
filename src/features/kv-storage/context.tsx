import { createContext, type ReactNode } from "react";
import { KVStorage } from "@lib/alga";

const KVStorageContext = createContext<{
  storage: KVStorage;
}>(null as any);

export type KVStorageProviderProps = {
  children: ReactNode;
  storage: KVStorage;
};

export const KVStorageProvider = ({
  children,
  storage,
}: KVStorageProviderProps) => {
  return (
    <KVStorageContext.Provider value={{ storage }}>
      {children}
    </KVStorageContext.Provider>
  );
};

export { KVStorageContext };
