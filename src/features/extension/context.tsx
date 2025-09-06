import { createContext, type ReactNode, useContext, useRef } from "react";
import { ExtensionClient } from "@lib/extension-data";

export type ExtensionContextType = {
  client: ExtensionClient;
};

const ExtensionContext = createContext<ExtensionContextType>(null as any);

export type ExtensionProviderProps = {
  children: ReactNode;
};

export const ExtensionProvider = ({ children }: ExtensionProviderProps) => {
  const client = useRef(new ExtensionClient());

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
