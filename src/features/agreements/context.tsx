import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AgreementsClient as SWOAgreementsClient } from "@lib/swo";
import { AgreementsClient as AlgaAgreementsClient } from "@lib/alga";
import { useQueryClient } from "@tanstack/react-query";
import { KVStorage } from "@lib/alga";

export const AgreementsContext = createContext<{
  swoClient?: SWOAgreementsClient;
  algaClient?: AlgaAgreementsClient;
}>(null as any);

export type AgreementsProviderProps = {
  children: ReactNode;
  kvStorage: KVStorage;
  baseUrl?: string;
  token?: string;
};

export const AgreementsProvider = ({
  children,
  kvStorage,
  baseUrl,
  token,
}: AgreementsProviderProps) => {
  const algaClient = useMemo(
    () => new AlgaAgreementsClient(kvStorage),
    [kvStorage]
  );

  const swoClient = useMemo(
    () =>
      baseUrl && token ? new SWOAgreementsClient(baseUrl, token) : undefined,
    [baseUrl, token]
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
