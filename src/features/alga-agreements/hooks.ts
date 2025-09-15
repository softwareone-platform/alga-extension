import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlgaAgreementsContext } from "./context";
import { AgreementChanges as AlgaAgreementChanges } from "@lib/alga";

export const useAlgaAgreements = (ids: string[]) => {
  const { client } = useContext(AlgaAgreementsContext);

  const { data: agreements, ...state } = useQuery({
    queryKey: ["alga-agreements", ids],
    queryFn: () => client!.getAgreements(ids),
    enabled: !!client,
  });

  return { agreements, ...state };
};

export const useAlgaAgreement = (id: string) => {
  const { client } = useContext(AlgaAgreementsContext);

  const { data: agreement, ...state } = useQuery({
    queryKey: ["alga-agreements", id],
    queryFn: () => client!.getAgreement(id),
    enabled: !!client,
  });

  return { agreement, ...state };
};

export const useAlgaAgreementSettingsMutation = () => {
  const { client } = useContext(AlgaAgreementsContext);

  const queryClient = useQueryClient();

  const {
    mutate: saveAgreement,
    mutateAsync: saveAgreementAsync,
    ...state
  } = useMutation({
    mutationFn: (changes: AlgaAgreementChanges) =>
      client!.saveAgreement(changes),
    onSuccess: (agreement) =>
      queryClient.setQueryData(["alga-agreements", agreement.id], agreement),
  });

  return { saveAgreement, saveAgreementAsync, state };
};
