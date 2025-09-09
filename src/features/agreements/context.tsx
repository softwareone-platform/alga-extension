import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AgreementsClient } from "@lib/swo-client";
import { useQueryClient } from "@tanstack/react-query";

const AgreementsContext = createContext<{
  client?: AgreementsClient;
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

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["agreements"] });
  }, [client]);

  return (
    <AgreementsContext.Provider value={{ client }}>
      {children}
    </AgreementsContext.Provider>
  );
};

export { AgreementsContext };