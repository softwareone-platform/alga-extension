import { useContext } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SubscriptionsContext } from "./context";
import { SubscriptionsOptions } from "@lib/swo";

export const useSubscriptions = (options?: SubscriptionsOptions) => {
  const { client } = useContext(SubscriptionsContext);

  const { data, ...state } = useQuery({
    queryKey: ["subscriptions", options],
    queryFn: () => client!.getSubscriptions(options),
    enabled: !!client,
    placeholderData: keepPreviousData,
  });

  const subscriptions = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { subscriptions, pagination, ...state };
};

export const useSubscription = (id: string) => {
  const { client } = useContext(SubscriptionsContext);

  const { data: subscription, ...state } = useQuery({
    queryKey: ["subscriptions", id],
    queryFn: () => client!.getSubscription(id),
    enabled: !!client,
  });

  return { subscription, ...state };
};
