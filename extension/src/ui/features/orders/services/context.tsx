import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { OrdersClient } from "@lib/swo";
import { useQueryClient } from "@tanstack/react-query";

export const OrdersContext = createContext<{
  client?: OrdersClient;
}>(null as any);

export type OrdersProviderProps = {
  children: ReactNode;
  baseUrl?: string;
  token?: string;
};

export const OrdersProvider = ({
  children,
  baseUrl,
  token,
}: OrdersProviderProps) => {
  const client = useMemo(
    () => (baseUrl && token ? new OrdersClient(baseUrl, token) : undefined),
    [baseUrl, token]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["orders"] });
  }, [client]);

  return (
    <OrdersContext.Provider value={{ client }}>
      {children}
    </OrdersContext.Provider>
  );
};