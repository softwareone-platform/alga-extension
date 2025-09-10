import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AgreementsClient as SWOAgreementsClient } from "@lib/swo";
import { useQueryClient } from "@tanstack/react-query";
import { AgreementsClient as AlgaAgreementsClient } from "@lib/alga";
import { useKVStorage } from "@features/kv-storage";

export const AgreementsContext = createContext<{
  swoClient?: SWOAgreementsClient;
  algaClient?: AlgaAgreementsClient;
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
  const kvStorage = useKVStorage();

  const swoClient = useMemo(
    () =>
      baseUrl && token ? new SWOAgreementsClient(baseUrl, token) : undefined,
    [baseUrl, token]
  );

  const algaClient = useMemo(
    () => (kvStorage ? new AlgaAgreementsClient(kvStorage) : undefined),
    [kvStorage]
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["agreements"] });
  }, [swoClient]);

  return (
    <AgreementsContext.Provider value={{ swoClient, algaClient }}>
      {children}
    </AgreementsContext.Provider>
  );
};
