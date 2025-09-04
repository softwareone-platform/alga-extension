import { useQuery } from "@tanstack/react-query";
import { type AgreementsOptions } from "../../../lib/swo-client/agreements-client";
import { useAgreementsClient } from "./agreements-context";

export const useAgreements = (options?: AgreementsOptions) => {
  const client = useAgreementsClient();

  return useQuery({
    queryKey: ["agreements", options],
    queryFn: () => client.getAgreements(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
