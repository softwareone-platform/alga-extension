import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgreementsContext } from "./context";
import { AgreementsOptions } from "@lib/swo";

export const useAgreements = (options?: AgreementsOptions) => {
  const { swoClient, algaClient } = useContext(AgreementsContext);

  return useQuery({
    queryKey: ["agreements", options],
    queryFn: () => swoClient!.getAgreements(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!swoClient,
  });
};

export const useAgreement = (id: string) => {
  const { swoClient } = useContext(AgreementsContext);

  return useQuery({
    queryKey: ["agreements", id],
    queryFn: () => swoClient!.getAgreement(id),
  });
};
