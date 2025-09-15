import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AgreementsClient as AlgaAgreementsClient } from "@lib/alga";
import { useQueryClient } from "@tanstack/react-query";
import { KVStorage } from "@lib/alga";

export const AlgaAgreementsContext = createContext<{
  client?: AlgaAgreementsClient;
}>(null as any);

export type AgreementsProviderProps = {
  children: ReactNode;
  kvStorage: KVStorage;
};

export const AlgaAgreementsProvider = ({
  children,
  kvStorage,
}: AgreementsProviderProps) => {
  const client = useMemo(
    () => new AlgaAgreementsClient(kvStorage),
    [kvStorage]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["alga-agreements"] });
  }, [client]);

  return (
    <AlgaAgreementsContext.Provider value={{ client }}>
      {children}
    </AlgaAgreementsContext.Provider>
  );
};
