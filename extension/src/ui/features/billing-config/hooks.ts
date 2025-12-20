import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/ui/lib/alga";
import {
  BillingConfigsRequestBody,
  BillingConfigsResponseBody,
} from "@/lib/billing-config";

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

export const useBillingConfig = (agreementId?: string) => {
  const { billingConfigs, ...state } = useBillingConfigs();
  return {
    billingConfig: billingConfigs?.find((v) => v.agreementId === agreementId),
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
    onSuccess: (bc) => queryClient.setQueryData(["billing-configs"], bc),
  });

  return { saveBillingConfigs, saveBillingConfigsAsync, state };
};
