import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/ui/lib/alga";
import {
  BillingConfigsRequestBody,
  BillingConfigsResponseBody,
} from "@/shared/billing-configs";

export const useBillingConfigs = () => {
  const { data: billingConfigs, ...state } = useQuery({
    queryKey: ["billing-configs"],
    queryFn: async () => {
      const { data } = await backendClient.get<BillingConfigsResponseBody>(
        "/billing-configs"
      );
      return data;
    },
    staleTime: Infinity,
  });

  return { billingConfigs, ...state };
};

export const useBillingConfigByAgreement = (agreementId?: string) => {
  const { billingConfigs, ...state } = useBillingConfigs();
  return {
    billingConfig: billingConfigs?.find((v) => v.agreementId === agreementId),
    ...state,
  };
};

export const useBillingConfigByConsumer = (consumerId?: string) => {
  const { billingConfigs, ...state } = useBillingConfigs();
  return {
    billingConfig: billingConfigs?.find((v) => v.consumerId === consumerId),
    ...state,
  };
};

export const useBillingConfigsMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: saveBillingConfigs,
    mutateAsync: saveBillingConfigsAsync,
    ...state
  } = useMutation({
    mutationFn: (changes: BillingConfigsRequestBody) =>
      backendClient.post<BillingConfigsResponseBody>(
        "/billing-configs",
        changes
      ),
    onSuccess: (response) =>
      queryClient.setQueryData(["billing-configs"], response.data),
  });

  return { saveBillingConfigs, saveBillingConfigsAsync, state };
};
