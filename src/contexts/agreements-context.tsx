import { createContext, useContext, type ReactNode } from "react";
import { AgreementsClient } from "../lib/swo-client/agreements-client";

interface AgreementsContextType {
  client: AgreementsClient;
}

const AgreementsContext = createContext<AgreementsContextType | null>(null);

interface AgreementsProviderProps {
  children: ReactNode;
  baseUrl: string;
  token: string;
}

export const AgreementsProvider = ({
  children,
  baseUrl,
  token,
}: AgreementsProviderProps) => {
  const client = new AgreementsClient(baseUrl, token);

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
