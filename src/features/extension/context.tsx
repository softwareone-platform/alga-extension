import { createContext, type ReactNode, useContext, useRef } from "react";
import { ExtensionClient } from "@lib/extension-data";
import { useKVStorage } from "@features/kv-storage";

export type ExtensionContextType = {
  client: ExtensionClient;
};

const ExtensionContext = createContext<ExtensionContextType>(null as any);

export type ExtensionProviderProps = {
  children: ReactNode;
};

export const ExtensionProvider = ({ children }: ExtensionProviderProps) => {
  const kvStorage = useKVStorage("extension");
  const client = useRef(new ExtensionClient(kvStorage));

  return (
    <ExtensionContext.Provider value={{ client: client.current }}>
      {children}
    </ExtensionContext.Provider>
  );
};

export const useExtensionClient = () => {
  const ctx = useContext(ExtensionContext);
  if (!ctx) {
    throw new Error(
      "useExtensionClient must be used within an ExtensionProvider"
    );
  }

  return ctx.client;
};
