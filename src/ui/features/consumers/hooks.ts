import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@lib/alga/url";
import { Consumer, ConsumersResponse } from "@/shared/consumers";

export const useConsumers = () => {
  const { data: consumers, ...rest } = useQuery({
    queryKey: ["consumers"],
    queryFn: async () => {
      const { data } = await backendClient.get<ConsumersResponse>(
        "/alga/clients",
      );
      return data.items;
    },
  });

  return { consumers, ...rest };
};

export const useConsumer = (id?: string) => {
  const { consumers, ...rest } = useConsumers();

  const consumer = consumers?.find(
    (c: Consumer) => c.clientId === id,
  );

  return { consumer, ...rest };
};
