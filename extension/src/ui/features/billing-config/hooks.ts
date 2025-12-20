import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/ui/lib/alga";
import {
  BillingConfigRequestBody,
  BillingConfigResponseBody,
} from "@/lib/billing-config";

export const useBillingConfigs = () => {
  const { data: billingConfigs, ...state } = useQuery({
    queryKey: ["billing-configs"],
    queryFn: async () => {
      const { data } = await backendClient.get<BillingConfigResponseBody>(
        "/billing-configs"
      );
      return data;
    },
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

export const useBillingConfigMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: saveBillingConfig,
    mutateAsync: saveBillingConfigAsync,
    ...state
  } = useMutation({
    mutationFn: (changes: BillingConfigRequestBody) =>
      backendClient.post<BillingConfigResponseBody>(
        "/billing-configs",
        changes
      ),
    onSuccess: (bc) => queryClient.setQueryData(["billing-configs"], bc),
  });

  return { saveBillingConfig, saveBillingConfigAsync, state };
};
