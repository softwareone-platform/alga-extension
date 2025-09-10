import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AgreementsClient } from "@lib/swo";
import { useQueryClient } from "@tanstack/react-query";
import { KVStorage } from "@lib/alga";
import { useKVStorage } from "@features/kv-storage";

export const AgreementsContext = createContext<{
  client?: AgreementsClient;
  kvClient?: KVStorage;
}>(null as any);

export type AgreementsProviderProps = {
  children: ReactNode;
  baseUrl: string;
  token: string;
};

export const AgreementsProvider = ({
  children,
  baseUrl,
  token,
}: AgreementsProviderProps) => {
  const client = useMemo(
    () => (baseUrl && token ? new AgreementsClient(baseUrl, token) : undefined),
    [baseUrl, token]
  );
  const kvClient = useKVStorage("agreements");
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["agreements"] });
  }, [client]);

  return (
    <AgreementsContext.Provider value={{ client, kvClient }}>
      {children}
    </AgreementsContext.Provider>
  );
};
