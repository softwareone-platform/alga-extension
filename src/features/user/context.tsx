import { createContext, useMemo, type ReactNode } from "react";
import { UsersClient } from "@lib/swo-client";

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
    <UserContext.Provider value={{ client }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };