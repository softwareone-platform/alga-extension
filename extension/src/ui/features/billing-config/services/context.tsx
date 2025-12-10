import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { BillingConfigClient, KVStorage } from "@lib/alga-proxy";
import { useQueryClient } from "@tanstack/react-query";
import { useUiProxy } from "@lib/proxy";

export const BillingConfigsContext = createContext<{
  client?: BillingConfigClient;
}>(null as any);

export type BillingConfigsProviderProps = {
  children: ReactNode;
  namespace?: string;
};

export const BillingConfigsProvider = ({
  children,
  namespace = "extension",
}: BillingConfigsProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(() => {
    const kvStorage = new KVStorage(uiProxy, namespace);
    return new BillingConfigClient(kvStorage);
  }, [uiProxy, namespace]);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["billing-configs"] });
  }, [client, queryClient]);

  if (!client) return null;

  return (
    <BillingConfigsContext.Provider value={{ client }}>
      {children}
    </BillingConfigsContext.Provider>
  );
};
