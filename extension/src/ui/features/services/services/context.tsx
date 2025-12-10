import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ServicesClient } from "@lib/alga-proxy";
import { useUiProxy } from "@lib/proxy";

const ServicesContext = createContext<{
  servicesClient?: ServicesClient;
}>(null as any);

export type ServicesProviderProps = {
  children: ReactNode;
};

export const ServicesProvider = ({
  children,
}: ServicesProviderProps) => {
  const uiProxy = useUiProxy();
  const servicesClient = useMemo(
    () => new ServicesClient(uiProxy),
    [uiProxy]
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["services"] });
  }, [servicesClient, queryClient]);

  return (
    <ServicesContext.Provider value={{ servicesClient }}>
      {children}
    </ServicesContext.Provider>
  );
};

export { ServicesContext };
