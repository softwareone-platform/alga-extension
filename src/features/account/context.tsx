import { createContext, useMemo, type ReactNode } from "react";
import { AccountsClient } from "@lib/swo-client";

const AccountContext = createContext<{
  client?: AccountsClient;
}>(null as any);

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
    () => (baseUrl && token ? new AccountsClient(baseUrl, token) : undefined),
    [baseUrl, token]
  );

  return (
    <AccountContext.Provider value={{ client }}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext };