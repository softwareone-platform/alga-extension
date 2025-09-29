import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { BillingConfigClient } from "@lib/alga";
import { useQueryClient } from "@tanstack/react-query";
import { KVStorage } from "@lib/alga";

export const BillingConfigsContext = createContext<{
  client?: BillingConfigClient;
}>(null as any);

export type BillingConfigsProviderProps = {
  children: ReactNode;
  kvStorage: KVStorage;
};

export const BillingConfigsProvider = ({
  children,
  kvStorage,
}: BillingConfigsProviderProps) => {
  const client = useMemo(() => new BillingConfigClient(kvStorage), [kvStorage]);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["billing-configs"] });
  }, [client]);

  return (
    <BillingConfigsContext.Provider value={{ client }}>
      {children}
    </BillingConfigsContext.Provider>
  );
};
