import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { StatementsClient } from "@lib/swo";
import { useQueryClient } from "@tanstack/react-query";

export const StatementsContext = createContext<{
  client?: StatementsClient;
}>(null as any);

export type StatementsProviderProps = {
  children: ReactNode;
  baseUrl?: string;
  token?: string;
};

export const StatementsProvider = ({
  children,
  baseUrl,
  token,
}: StatementsProviderProps) => {
  const client = useMemo(
    () => (baseUrl && token ? new StatementsClient(baseUrl, token) : undefined),
    [baseUrl, token]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["statements"] });
  }, [client]);

  return (
    <StatementsContext.Provider value={{ client }}>
      {children}
    </StatementsContext.Provider>
  );
};
