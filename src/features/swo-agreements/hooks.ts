import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { SWOAgreementsContext } from "./context";
import { AgreementsOptions } from "@lib/swo";

export const useSWOAgreements = (options?: AgreementsOptions) => {
  const { client: swoClient } = useContext(SWOAgreementsContext);

  return useQuery({
    queryKey: ["swo-agreements", options],
    queryFn: () => swoClient!.getAgreements(options),
    enabled: !!swoClient,
  });
};

export const useSWOAgreement = (id: string) => {
  const { client: swoClient } = useContext(SWOAgreementsContext);

  const { data: agreement, ...state } = useQuery({
    queryKey: ["swo-agreements", id],
    queryFn: () => swoClient!.getAgreement(id),
    enabled: !!swoClient,
  });

  return { agreement, ...state };
};
