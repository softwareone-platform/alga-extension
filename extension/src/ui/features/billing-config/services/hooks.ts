import { useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BillingConfigsContext } from "./context";
import { BillingConfigChanges } from "@lib/alga-proxy";

export const useBillingConfigs = () => {
  const { client } = useContext(BillingConfigsContext);

  const { data: billingConfigs, ...state } = useQuery({
    queryKey: ["billing-configs"],
    queryFn: () => client!.getAll(),
    enabled: !!client,
    staleTime: Infinity,
  });

  return { billingConfigs, ...state };
};

export const useBillingConfig = (agreementId?: string) => {
  const { billingConfigs, ...state } = useBillingConfigs();

  const billingConfig = useMemo(() => {
    return billingConfigs?.find((v) => v.agreementId === agreementId);
  }, [billingConfigs, agreementId]);

  return { billingConfig, ...state };
};

export const useBillingConfigsByConsumer = (consumerId: string) => {
  const { billingConfigs: all, ...state } = useBillingConfigs();

  const billingConfigs = useMemo(() => {
    return all?.filter((v) => v.consumer?.id === consumerId);
  }, [all, consumerId]);

  return { billingConfigs, ...state };
};

export const useBillingConfigsByAgreements = (agreementsIds: string[]) => {
  const { billingConfigs: all, ...state } = useBillingConfigs();

  const billingConfigs = useMemo(() => {
    return all?.filter((v) => agreementsIds.includes(v.agreementId));
  }, [all, agreementsIds]);

  return { billingConfigs, ...state };
};

export const useBillingConfigMutation = () => {
  const { client } = useContext(BillingConfigsContext);

  const queryClient = useQueryClient();

  const {
    mutate: saveBillingConfig,
    mutateAsync: saveBillingConfigAsync,
    ...state
  } = useMutation({
    mutationFn: (changes: BillingConfigChanges) => client!.save(changes),
    onSuccess: (bc) => queryClient.setQueryData(["billing-configs"], bc)
  });

  return { saveBillingConfig, saveBillingConfigAsync, state };
};
