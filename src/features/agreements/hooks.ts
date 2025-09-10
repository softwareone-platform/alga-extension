import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AgreementsContext } from "./context";
import { AgreementsOptions } from "@lib/swo";
import { AgreementSettings } from "./models";

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

export const useAgreementSettings = (id: string) => {
  const { kvClient } = useContext(AgreementsContext);

  return useQuery({
    queryKey: ["agreements", id, "settings"],
    queryFn: () => kvClient!.get(`${id}:settings`),
  });
};

export const useAgreementSettingsMutation = (id: string) => {
  const { kvClient } = useContext(AgreementsContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: AgreementSettings) =>
      kvClient!.set(`${id}:settings`, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agreements", id, "settings"],
      });
    },
  });
};
