import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AgreementsContext } from "./context";
import { AgreementsOptions } from "@lib/swo";
import { AgreementChanges as AlgaAgreementChanges } from "@lib/alga";

export const useAgreements = (options?: AgreementsOptions) => {
  const { swoClient } = useContext(AgreementsContext);

  return useQuery({
    queryKey: ["agreements", options],
    queryFn: () => swoClient!.getAgreements(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!swoClient,
  });
};

export const useSWOAgreement = (id: string) => {
  const { swoClient } = useContext(AgreementsContext);

  const { data: agreement, ...state } = useQuery({
    queryKey: ["agreements", "swo", id],
    queryFn: () => swoClient!.getAgreement(id),
    enabled: !!swoClient,
  });

  return { agreement, ...state };
};

export const useAlgaAgreement = (id: string) => {
  const { algaClient } = useContext(AgreementsContext);

  const { data: agreement, ...state } = useQuery({
    queryKey: ["agreements", "alga", id],
    queryFn: () => algaClient!.getAgreement(id),
    enabled: !!algaClient,
  });

  return { agreement, ...state };
};

export const useAlgaAgreementSettingsMutation = () => {
  const { algaClient } = useContext(AgreementsContext);

  const queryClient = useQueryClient();

  const {
    mutate: saveAgreement,
    mutateAsync: saveAgreementAsync,
    ...state
  } = useMutation({
    mutationFn: (changes: AlgaAgreementChanges) =>
      algaClient!.saveAgreement(changes),
    onSuccess: (agreement) =>
      queryClient.setQueryData(["agreements", "alga", agreement.id], agreement),
  });

  return { saveAgreement, saveAgreementAsync, state };
};
