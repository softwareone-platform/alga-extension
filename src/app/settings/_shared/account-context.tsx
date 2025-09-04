import { createContext, useContext, useMemo, type ReactNode } from "react";
import { AccountsClient } from "@lib/swo-client";
import { useQuery } from "@tanstack/react-query";

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

export const useAccount = () => {
  const { client } = useContext(AccountContext);

  return useQuery({
    queryKey: ["account"],
    queryFn: () => client!.getAccount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!client,
  });
};
