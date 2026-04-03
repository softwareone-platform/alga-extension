import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@lib/alga";
import { AlgaService, ServicesResponse } from "@/shared/services";

export const useServices = () => {
  const { data: services, ...rest } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } =
        await backendClient.get<ServicesResponse>("/alga/services");
      return data;
    },
  });

  return { services, ...rest };
};

export const useService = (id?: string) => {
  const { services, ...rest } = useServices();

  const service = services?.find((s: AlgaService) => s.serviceId === id);

  return { service, ...rest };
};
