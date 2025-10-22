import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServicesContext } from "./context";

export const useServices = () => {
  const { servicesClient } = useContext(ServicesContext);

  const { data: services, ...rest } = useQuery({
    queryKey: ["services"],
    queryFn: () => servicesClient!.getServices(),
    enabled: !!servicesClient,
  });

  return { services, ...rest };
};

export const useService = (id: string) => {
  const { servicesClient } = useContext(ServicesContext);

  const { data: service, ...rest } = useQuery({
    queryKey: ["service", id],
    queryFn: () => servicesClient!.getService(id!),
    enabled: !!servicesClient && !!id,
  });

  return { service, ...rest };
};
