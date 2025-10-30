import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { BillingConfigClient } from "@lib/alga";
import { useQueryClient } from "@tanstack/react-query";
import { KVStorage } from "@lib/alga";
import { useExtensionDetails } from "@features/extension";
import { CredentialsClient } from "@lib/swo";

export const BillingConfigsContext = createContext<{
  client?: BillingConfigClient;
}>(null as any);

export type BillingConfigsProviderProps = {
  children: ReactNode;
  kvStorage: KVStorage;
  algaKey: string;
  baseUrl: string;
};

export const BillingConfigsProvider = ({
  children,
  kvStorage,
  algaKey,
  baseUrl,
}: BillingConfigsProviderProps) => {
  const { details } = useExtensionDetails();

  const credentialsClient = useMemo(() => {
    if (!details?.endpoint || !details?.token || !algaKey) return undefined;

    return new CredentialsClient(baseUrl, details.token, algaKey);
  }, [details?.endpoint, details?.token, algaKey]);

  const client = useMemo(() => {
    if (!credentialsClient) return undefined;

    return new BillingConfigClient(kvStorage, credentialsClient);
  }, [kvStorage, credentialsClient]);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["billing-configs"] });
  }, [client]);

  if (!client) return null;

  return (
    <BillingConfigsContext.Provider value={{ client }}>
      {children}
    </BillingConfigsContext.Provider>
  );
};
