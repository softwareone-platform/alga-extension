import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { OrdersClient } from "@lib/swo-proxy";
import { useQueryClient } from "@tanstack/react-query";
import { useUiProxy } from "@lib/proxy";

export const OrdersContext = createContext<{
  client?: OrdersClient;
}>(null as any);

export type OrdersProviderProps = {
  children: ReactNode;
};

export const OrdersProvider = ({
  children,
}: OrdersProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(
    () => new OrdersClient({ uiProxy }),
    [uiProxy]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["orders"] });
  }, [client, queryClient]);

  return (
    <OrdersContext.Provider value={{ client }}>
      {children}
    </OrdersContext.Provider>
  );
};
