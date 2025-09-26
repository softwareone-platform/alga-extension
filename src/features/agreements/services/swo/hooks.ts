import { useContext } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AgreementsContext as AgreementsContext } from "./context";
import {
  AgreementsOptions,
  OrdersOptions,
  SubscriptionsOptions,
} from "@lib/swo";

export const useAgreements = (options?: AgreementsOptions) => {
  const { client } = useContext(AgreementsContext);

  const { data, ...state } = useQuery({
    queryKey: ["agreements", options],
    queryFn: () => client!.getAgreements(options),
    enabled: !!client,
    placeholderData: keepPreviousData,
  });

  const agreements = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { agreements, pagination, ...state };
};

export const useAgreement = (id: string) => {
  const { client } = useContext(AgreementsContext);

  const { data: agreement, ...state } = useQuery({
    queryKey: ["agreements", id],
    queryFn: () => client!.getAgreement(id),
    enabled: !!client,
  });

  return { agreement, ...state };
};

export const useAgreementSubscriptions = (
  agreementId: string,
  options?: SubscriptionsOptions
) => {
  const { client } = useContext(AgreementsContext);

  const { data, ...state } = useQuery({
    queryKey: ["agreements", agreementId, "subscriptions", options],
    queryFn: () => client!.getSubscriptions(agreementId, options),
    enabled: !!client,
    placeholderData: keepPreviousData,
  });

  const subscriptions = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { subscriptions, pagination, ...state };
};

export const useAgreementOrders = (
  agreementId: string,
  options?: OrdersOptions
) => {
  const { client } = useContext(AgreementsContext);

  const { data, ...state } = useQuery({
    queryKey: ["agreements", agreementId, "orders", options],
    queryFn: () => client!.getOrders(agreementId, options),
    enabled: !!client,
    placeholderData: keepPreviousData,
  });

  const orders = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { orders, pagination, ...state };
};
