import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BillingConfigsContext } from "./context";
import { BillingConfigChanges } from "@lib/alga";

export const useBillingConfigs = (agreementsIds: string[]) => {
  const { client } = useContext(BillingConfigsContext);

  const { data: billingConfigs, ...state } = useQuery({
    queryKey: ["billing-configs", agreementsIds],
    queryFn: () => client!.getByAgreementsIds(agreementsIds),
    enabled: !!client,
  });

  return { billingConfigs, ...state };
};

export const useBillingConfig = (agreementId?: string) => {
  const { client } = useContext(BillingConfigsContext);

  const { data: billingConfig, ...state } = useQuery({
    queryKey: ["billing-configs", agreementId],
    queryFn: () => client!.getByAgreementId(agreementId!),
    enabled: !!client && !!agreementId,
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
    mutationFn: (changes: BillingConfigChanges) => client!.save(changes),
    onSuccess: (billingConfig) =>
      queryClient.setQueryData(
        ["billing-configs", billingConfig.agreementId],
        billingConfig
      ),
  });

  return { saveBillingConfig, saveBillingConfigAsync, state };
};
