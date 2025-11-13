import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "./context";

export const useUser = () => {
  const { client } = useContext(UserContext);

  return useQuery({
    queryKey: ["user"],
    queryFn: () => client!.getUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!client,
  });
};