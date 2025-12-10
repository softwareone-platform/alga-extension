import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { ClientsClient } from "@lib/alga-proxy";
import { useQueryClient } from "@tanstack/react-query";
import { useUiProxy } from "@lib/proxy";

const ConsumersContext = createContext<{
  client?: ClientsClient;
}>(null as any);

export type ConsumersProviderProps = {
  children: ReactNode;
};

export const ConsumersProvider = ({
  children,
}: ConsumersProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(
    () => new ClientsClient(uiProxy),
    [uiProxy]
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["consumers"] });
  }, [client, queryClient]);

  return (
    <ConsumersContext.Provider value={{ client }}>
      {children}
    </ConsumersContext.Provider>
  );
};

export { ConsumersContext };
