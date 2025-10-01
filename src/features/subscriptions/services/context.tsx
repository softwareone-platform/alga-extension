import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { SubscriptionsClient } from "@lib/swo";
import { useQueryClient } from "@tanstack/react-query";

export const SubscriptionsContext = createContext<{
  client?: SubscriptionsClient;
}>(null as any);

export type SubscriptionsProviderProps = {
  children: ReactNode;
  baseUrl?: string;
  token?: string;
};

export const SubscriptionsProvider = ({
  children,
  baseUrl,
  token,
}: SubscriptionsProviderProps) => {
  const client = useMemo(
    () => (baseUrl && token ? new SubscriptionsClient(baseUrl, token) : undefined),
    [baseUrl, token]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["subscriptions"] });
  }, [client]);

  return (
    <SubscriptionsContext.Provider value={{ client }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};
