import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AccountsClient } from "@lib/swo-proxy";
import { useQueryClient } from "@tanstack/react-query";
import { useUiProxy } from "@lib/proxy";

const AccountContext = createContext<{
  client?: AccountsClient;
}>(null as any);

export type AccountProviderProps = {
  children: ReactNode;
};

export const AccountProvider = ({
  children,
}: AccountProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(
    () => new AccountsClient({ uiProxy }),
    [uiProxy]
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["account"] });
  }, [client, queryClient]);

  return (
    <AccountContext.Provider value={{ client }}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext };
