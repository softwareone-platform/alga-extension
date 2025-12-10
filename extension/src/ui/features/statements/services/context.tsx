import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { StatementsClient } from "@lib/swo-proxy";
import { useQueryClient } from "@tanstack/react-query";
import { useUiProxy } from "@lib/proxy";

export const StatementsContext = createContext<{
  client?: StatementsClient;
}>(null as any);

export type StatementsProviderProps = {
  children: ReactNode;
};

export const StatementsProvider = ({
  children,
}: StatementsProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(
    () => new StatementsClient({ uiProxy }),
    [uiProxy]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["statements"] });
  }, [client, queryClient]);

  return (
    <StatementsContext.Provider value={{ client }}>
      {children}
    </StatementsContext.Provider>
  );
};
