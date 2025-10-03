import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ConsumersContext } from "./context";

export const useConsumers = () => {
  const { client } = useContext(ConsumersContext);

  const { data: consumers, ...rest } = useQuery({
    queryKey: ["consumers"],
    queryFn: () => client!.getCompanies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!client,
  });

  return { consumers, ...rest };
};

export const useConsumer = (id: string) => {
  const { client } = useContext(ConsumersContext);

  const { data: consumer, ...rest } = useQuery({
    queryKey: ["consumer", id],
    queryFn: () => client!.getCompany(id!),
    enabled: !!client && !!id,
  });

  return { consumer, ...rest };
};
