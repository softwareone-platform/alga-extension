import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { AgreementsClient } from "@lib/swo-proxy";
import { useQueryClient } from "@tanstack/react-query";
import { useUiProxy } from "@lib/proxy";

export const AgreementsContext = createContext<{
  client?: AgreementsClient;
}>(null as any);

export type AgreementsProviderProps = {
  children: ReactNode;
};

export const AgreementsProvider = ({
  children,
}: AgreementsProviderProps) => {
  const uiProxy = useUiProxy();
  const client = useMemo(
    () => new AgreementsClient({ uiProxy }),
    [uiProxy]
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["agreements"] });
  }, [client, queryClient]);

  return (
    <AgreementsContext.Provider value={{ client }}>
      {children}
    </AgreementsContext.Provider>
  );
};
