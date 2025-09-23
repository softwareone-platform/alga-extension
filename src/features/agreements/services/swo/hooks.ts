import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgreementsContext as AgreementsContext } from "./context";
import { AgreementsOptions } from "@lib/swo";

export const useAgreements = (options?: AgreementsOptions) => {
  const { client } = useContext(AgreementsContext);

  const { data: agreements, ...state } = useQuery({
    queryKey: ["agreements", options],
    queryFn: () => client!.getAgreements(options),
    enabled: !!client,
  });

  return { agreements, ...state };
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

  const { data: subscriptions, ...state } = useQuery({
    queryKey: ["agreements", agreementId, "subscriptions"],
    queryFn: () => client!.getSubscriptions(agreementId),
    enabled: !!client,
  });

  return { subscriptions, ...state };
};

export const useAgreementOrders = (agreementId: string) => {
  const { client } = useContext(AgreementsContext);

  const { data: orders, ...state } = useQuery({
    queryKey: ["agreements", agreementId, "orders"],
    queryFn: () => client!.getOrders(agreementId),
    enabled: !!client,
  });

  return { orders, ...state };
};
