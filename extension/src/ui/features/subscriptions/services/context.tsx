import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { SubscriptionsClient } from "@lib/swo-proxy";
import { useQueryClient } from "@tanstack/react-query";
import { useUiProxy } from "@lib/proxy";

export const SubscriptionsContext = createContext<{
  client?: SubscriptionsClient;
}>(null as any);

export type SubscriptionsProviderProps = {
  children: ReactNode;
};

export const SubscriptionsProvider = ({
  children,
}: SubscriptionsProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(
    () => new SubscriptionsClient({ uiProxy }),
    [uiProxy]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["subscriptions"] });
  }, [client, queryClient]);

  return (
    <SubscriptionsContext.Provider value={{ client }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};
