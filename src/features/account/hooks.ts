import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AccountContext } from "./context";

export const useAccount = () => {
  const { client } = useContext(AccountContext);

  return useQuery({
    queryKey: ["account"],
    queryFn: () => client!.getAccount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!client,
  });
};
