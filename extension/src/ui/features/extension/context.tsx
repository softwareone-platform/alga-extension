import { createContext, type ReactNode, useContext, useMemo } from "react";
import { ExtensionClient, KVStorage } from "@lib/alga-proxy";
import { useUiProxy } from "@lib/proxy";

export type ExtensionContextType = {
  client: ExtensionClient;
};

const ExtensionContext = createContext<ExtensionContextType>(null as any);

export type ExtensionProviderProps = {
  children: ReactNode;
  namespace?: string;
};

export const ExtensionProvider = ({
  children,
  namespace = "extension",
}: ExtensionProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(() => {
    const kvStorage = new KVStorage(uiProxy, namespace);
    return new ExtensionClient(kvStorage);
  }, [uiProxy, namespace]);

  return (
    <ExtensionContext.Provider value={{ client }}>
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
