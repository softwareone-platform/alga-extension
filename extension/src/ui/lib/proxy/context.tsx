import { createContext, useContext, type ReactNode } from "react";
import type { UiProxyHost } from "./types";

export type ProxyBridgeContextType = {
  uiProxy: UiProxyHost;
};

const ProxyBridgeContext = createContext<ProxyBridgeContextType | null>(null);

export type ProxyBridgeProviderProps = {
  children: ReactNode;
  uiProxy: UiProxyHost;
};

export const ProxyBridgeProvider = ({
  children,
  uiProxy,
}: ProxyBridgeProviderProps) => {
  return (
    <ProxyBridgeContext.Provider value={{ uiProxy }}>
      {children}
    </ProxyBridgeContext.Provider>
  );
};

export const useProxyBridge = (): ProxyBridgeContextType => {
  const ctx = useContext(ProxyBridgeContext);
  if (!ctx) {
    throw new Error("useProxyBridge must be used within a ProxyBridgeProvider");
  }
  return ctx;
};

export const useUiProxy = (): UiProxyHost => {
  return useProxyBridge().uiProxy;
};
