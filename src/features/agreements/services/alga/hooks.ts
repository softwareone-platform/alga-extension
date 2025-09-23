import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BillingConfigsContext } from "./context";
import { BillingConfigChanges } from "@lib/alga";

export const useBillingConfigs = (ids: string[]) => {
  const { client } = useContext(BillingConfigsContext);

  const { data: billingConfigs, ...state } = useQuery({
    queryKey: ["billing-configs", ids],
    queryFn: () => client!.getBillingConfigs(ids),
    enabled: !!client,
  });

  return { billingConfigs, ...state };
};

export const useBillingConfig = (id: string) => {
  const { client } = useContext(BillingConfigsContext);

  const { data: billingConfig, ...state } = useQuery({
    queryKey: ["billing-configs", id],
    queryFn: () => client!.getBillingConfig(id),
    enabled: !!client,
  });

  return { billingConfig, ...state };
};

export const useBillingConfigMutation = () => {
  const { client } = useContext(BillingConfigsContext);

  const queryClient = useQueryClient();

  const {
    mutate: saveBillingConfig,
    mutateAsync: saveBillingConfigAsync,
    ...state
  } = useMutation({
    mutationFn: (changes: BillingConfigChanges) =>
      client!.saveBillingConfig(changes),
    onSuccess: (billingConfig) =>
      queryClient.setQueryData(
        ["billing-configs", billingConfig.id],
        billingConfig
      ),
  });

  return { saveBillingConfig, saveBillingConfigAsync, state };
};
