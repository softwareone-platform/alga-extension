import { createContext, useContext, useMemo, type ReactNode } from "react";
import { AgreementsClient, AgreementsOptions } from "@lib/swo-client";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "../../settings/_shared";

const AgreementsContext = createContext<{
  client: AgreementsClient;
}>(null as any);

export type AgreementsProviderProps = {
  children: ReactNode;
};

export const AgreementsProvider = ({ children }: AgreementsProviderProps) => {
  const { settings } = useSettings();
  const { endpoint, token } = settings;

  const client = useMemo(
    () => new AgreementsClient(endpoint, token),
    [endpoint, token]
  );

  return (
    <AgreementsContext.Provider value={{ client }}>
      {children}
    </AgreementsContext.Provider>
  );
};

export const useAgreements = (options?: AgreementsOptions) => {
  const { client } = useContext(AgreementsContext);
  const { settings } = useSettings();

  const { endpoint, token } = settings;

  return useQuery({
    queryKey: ["agreements", endpoint, token, options],
    queryFn: () => client.getAgreements(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!(endpoint && token),
  });
};
