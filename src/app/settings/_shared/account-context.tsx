import { createContext, useContext, useMemo, type ReactNode } from "react";
import { AccountsClient } from "@lib/swo-client";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@features/settings";

const AccountContext = createContext<{
  client: AccountsClient;
}>(null as any);

export type AccountProviderProps = {
  children: ReactNode;
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const { settings } = useSettings();
  const { endpoint, token } = settings;

  const client = useMemo(
    () => new AccountsClient(endpoint, token),
    [endpoint, token]
  );

  return (
    <AccountContext.Provider value={{ client }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const { client } = useContext(AccountContext);
  const { settings } = useSettings();

  const { endpoint, token } = settings;

  return useQuery({
    queryKey: ["account", endpoint, token],
    queryFn: () => client.getAccount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!(endpoint && token),
  });
};
