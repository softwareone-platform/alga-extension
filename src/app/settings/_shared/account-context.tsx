import { createContext, useContext, useMemo, type ReactNode } from "react";
import { AccountsClient } from "@lib/swo-client";

const AccountContext = createContext<{
  client: AccountsClient;
} | null>(null);

export type AccountProviderProps = {
  children: ReactNode;
  baseUrl: string;
  token: string;
};

export const AccountProvider = ({
  children,
  baseUrl,
  token,
}: AccountProviderProps) => {
  const client = useMemo(
    () => (baseUrl && token ? new AccountsClient(baseUrl, token) : null),
    [baseUrl, token]
  );

  return (
    <AccountContext.Provider value={client ? { client } : null}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountClient = () => {
  const context = useContext(AccountContext);
  return context?.client;
};
