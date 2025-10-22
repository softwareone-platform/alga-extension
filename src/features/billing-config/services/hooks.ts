import { useCallback, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BillingConfigsContext } from "./context";
import { BillingConfig, BillingConfigChanges } from "@lib/alga";

export const useBillingConfigsByAgreements = (agreementsIds: string[]) => {
  const { client } = useContext(BillingConfigsContext);
  const queryClient = useQueryClient();

  const getById = useCallback(
    async (id: string) => {
      const cached = queryClient.getQueryData<BillingConfig>([
        "billing-configs",
        id,
      ]);
      if (cached) return cached;

      const result = await client!.getByAgreementId(id);
      if (result) queryClient.setQueryData(["billing-configs", id], result);

      return result;
    },
    [queryClient]
  );

  const { data: billingConfigs, ...state } = useQuery({
    queryKey: ["billing-configs", agreementsIds],
    queryFn: async () => {
      const results = await Promise.all(agreementsIds.map(getById));
      return results.filter((result) => !!result);
    },
    enabled: !!client,
  });

  return { billingConfigs, ...state };
};

export const useBillingConfigsByConsumer = (consumerId: string) => {
  const { client } = useContext(BillingConfigsContext);

  const { data: billingConfigs, ...state } = useQuery({
    queryKey: ["billing-configs", consumerId],
    queryFn: () => client!.getByConsumerId(consumerId),
    enabled: !!client,
    staleTime: Infinity,
  });

  return { billingConfigs, ...state };
};

export const useBillingConfig = (agreementId?: string) => {
  const { client } = useContext(BillingConfigsContext);

  const { data: billingConfig, ...state } = useQuery({
    queryKey: ["billing-configs", agreementId],
    queryFn: () => client!.getByAgreementId(agreementId!),
    enabled: !!client && !!agreementId,
    staleTime: Infinity,
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
