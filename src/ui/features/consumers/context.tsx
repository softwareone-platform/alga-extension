import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { ClientsClient } from "@lib/alga";
import { useQueryClient } from "@tanstack/react-query";

const ConsumersContext = createContext<{
  client?: ClientsClient;
}>(null as any);

export type ConsumersProviderProps = {
  children: ReactNode;
  baseUrl: string;
  apiKey: string;
};

export const ConsumersProvider = ({
  children,
  baseUrl,
  apiKey,
}: ConsumersProviderProps) => {
  const client = useMemo(
    () => new ClientsClient(baseUrl, apiKey),
    [baseUrl, apiKey]
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["consumers"] });
  }, [client]);

  return (
    <ConsumersContext.Provider value={{ client }}>
      {children}
    </ConsumersContext.Provider>
  );
};

export { ConsumersContext };
