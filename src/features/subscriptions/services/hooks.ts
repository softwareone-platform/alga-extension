import { useContext } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SubscriptionsContext } from "./context";
import {
  SubscriptionsClientSubscriptionsOptions,
  SubscriptionsClientOrdersOptions,
} from "@lib/swo";

export const useSubscriptions = (
  options?: SubscriptionsClientSubscriptionsOptions,
  agreementIds?: string[]
) => {
  const { client } = useContext(SubscriptionsContext);

  const { data, ...state } = useQuery({
    queryKey: ["subscriptions", options],
    queryFn: () => client!.getSubscriptions(options, agreementIds),
    enabled: !!client && (!agreementIds || agreementIds.length > 0),
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

export const useSubscriptionItems = (id: string) => {
  const { subscription, ...state } = useSubscription(id);

  const items = subscription?.lines || [];

  return { items, subscription, ...state };
};

export const useSubscriptionOrders = (
  id: string,
  options?: SubscriptionsClientOrdersOptions
) => {
  const { client } = useContext(SubscriptionsContext);

  const { data, ...state } = useQuery({
    queryKey: ["subscriptions", id, "orders", options],
    queryFn: () => client!.getOrders(id, options),
    enabled: !!client,
    placeholderData: keepPreviousData,
  });

  const orders = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { orders, pagination, ...state };
};
