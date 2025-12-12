import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/ui/lib/alga";
import { AccountQueryModelListResponse } from "@swo/mp-api-model";
import { useExtensionDetails } from "../extension";

export const useAccount = () => {
  const { details } = useExtensionDetails();

  const { data: account, ...rest } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await backendClient.get<AccountQueryModelListResponse>(
        `/swo/accounts/accounts`
      );
      return response.data.data?.[0];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!details?.token && !!details?.endpoint,
  });

  return { account, ...rest };
};
