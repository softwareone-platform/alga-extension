import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgreementsContext as AgreementsContext } from "./context";
import { AgreementsOptions } from "@lib/swo";

export const useAgreements = (options?: AgreementsOptions) => {
  const { client } = useContext(AgreementsContext);

  const { data, ...state } = useQuery({
    queryKey: ["agreements", options],
    queryFn: () => client!.getAgreements(options),
    enabled: !!client,
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

export const useAgreementSubscriptions = (agreementId: string) => {
  const { client } = useContext(AgreementsContext);

  const { data, ...state } = useQuery({
    queryKey: ["agreements", agreementId, "subscriptions"],
    queryFn: () => client!.getSubscriptions(agreementId),
    enabled: !!client,
  });

  const subscriptions = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { subscriptions, pagination, ...state };
};

export const useAgreementOrders = (agreementId: string) => {
  const { client } = useContext(AgreementsContext);

  const { data, ...state } = useQuery({
    queryKey: ["agreements", agreementId, "orders"],
    queryFn: () => client!.getOrders(agreementId),
    enabled: !!client,
  });

  const orders = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { orders, pagination, ...state };
};
