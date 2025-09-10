import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AgreementsContext } from "./context";
import { AgreementsOptions } from "@lib/swo";

export const useAgreements = (options?: AgreementsOptions) => {
  const { client } = useContext(AgreementsContext);

  return useQuery({
    queryKey: ["agreements", options],
    queryFn: () => client!.getAgreements(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!client,
  });
};

export const useAgreement = (id: string) => {
  const { client } = useContext(AgreementsContext);

  return useQuery({
    queryKey: ["agreements", id],
    queryFn: () => client!.getAgreement(id),
  });
};
