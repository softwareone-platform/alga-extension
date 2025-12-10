import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { UsersClient } from "@lib/swo-proxy";
import { useQueryClient } from "@tanstack/react-query";
import { useUiProxy } from "@lib/proxy";

const UserContext = createContext<{
  client?: UsersClient;
}>(null as any);

export type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({
  children,
}: UserProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(
    () => new UsersClient({ uiProxy }),
    [uiProxy]
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["user"] });
  }, [client, queryClient]);

  return (
    <UserContext.Provider value={{ client }}>{children}</UserContext.Provider>
  );
};

export { UserContext };
