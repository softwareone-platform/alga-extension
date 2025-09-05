import { createContext, useContext, useMemo, type ReactNode } from "react";
import { AgreementsClient, AgreementsOptions } from "@lib/swo-client";
import { useQuery } from "@tanstack/react-query";

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
    () => new AgreementsClient(baseUrl, token),
    [baseUrl, token]
  );

  return (
    <AgreementsContext.Provider value={{ client }}>
      {children}
    </AgreementsContext.Provider>
  );
};

export const useAgreements = (options?: AgreementsOptions) => {
  const { client } = useContext(AgreementsContext);

  return useQuery({
    queryKey: ["agreements", options],
    queryFn: () => client!.getAgreements(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!client,
  });
};
