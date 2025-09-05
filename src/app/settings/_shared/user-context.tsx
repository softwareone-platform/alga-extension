import { createContext, useContext, useMemo, type ReactNode } from "react";
import { UsersClient } from "@lib/swo-client/users-client";
import { useQuery } from "@tanstack/react-query";

const UserContext = createContext<{
  client?: UsersClient;
}>(null as any);

export type UserProviderProps = {
  children: ReactNode;
  baseUrl: string;
  token: string;
};

export const UserProvider = ({
  children,
  baseUrl,
  token,
}: UserProviderProps) => {
  const client = useMemo(
    () => (baseUrl && token ? new UsersClient(baseUrl, token) : undefined),
    [baseUrl, token]
  );

  return (
    <UserContext.Provider value={{ client }}>{children}</UserContext.Provider>
  );
};

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
