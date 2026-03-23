import { createContext, useEffect, useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ServicesClient } from "@lib/alga/services";

const ServicesContext = createContext<{
  servicesClient?: ServicesClient;
}>(null as any);

export type ServicesProviderProps = {
  children: ReactNode;
  baseUrl: string;
  apiKey: string;
};

export const ServicesProvider = ({
  children,
  baseUrl,
  apiKey,
}: ServicesProviderProps) => {
  const servicesClient = useMemo(
    () => new ServicesClient(baseUrl, apiKey),
    [baseUrl, apiKey]
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["services"] });
  }, [servicesClient]);

  return (
    <ServicesContext.Provider value={{ servicesClient }}>
      {children}
    </ServicesContext.Provider>
  );
};

export { ServicesContext };
