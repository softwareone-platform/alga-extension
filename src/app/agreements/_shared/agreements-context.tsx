import { createContext, useContext, useMemo, type ReactNode } from "react";
import { AgreementsClient } from "@lib/swo-client";

const AgreementsContext = createContext<{
  client: AgreementsClient;
} | null>(null);

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

export const useAgreementsClient = () => {
  const context = useContext(AgreementsContext);
  if (!context) {
    throw new Error(
      "useAgreementsContext must be used within an AgreementsProvider"
    );
  }
  return context.client;
};
