import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AccountsClient } from "@lib/swo";
import { useQueryClient } from "@tanstack/react-query";

const AccountContext = createContext<{
  client?: AccountsClient;
}>(null as any);

export type AccountProviderProps = {
  children: ReactNode;
  baseUrl?: string;
  token?: string;
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

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["account"] });
  }, [client]);

  return (
    <AccountContext.Provider value={{ client }}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext };
