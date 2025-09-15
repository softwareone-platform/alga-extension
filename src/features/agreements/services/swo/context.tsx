import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AgreementsClient as SWOAgreementsClient } from "@lib/swo";
import { useQueryClient } from "@tanstack/react-query";

export const SWOAgreementsContext = createContext<{
  client?: SWOAgreementsClient;
}>(null as any);

export type AgreementsProviderProps = {
  children: ReactNode;
  baseUrl?: string;
  token?: string;
};

export const SWOAgreementsProvider = ({
  children,
  baseUrl,
  token,
}: AgreementsProviderProps) => {
  const client = useMemo(
    () =>
      baseUrl && token ? new SWOAgreementsClient(baseUrl, token) : undefined,
    [baseUrl, token]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["swo-agreements"] });
  }, [client]);

  return (
    <SWOAgreementsContext.Provider value={{ client }}>
      {children}
    </SWOAgreementsContext.Provider>
  );
};
