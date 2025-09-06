import { Outlet } from "react-router";
import { AgreementsProvider } from "./_shared/agreements-context";
import { useExtension } from "@features/extension";

export function AgreementsLayout() {
  const { settings } = useExtension();
  const { endpoint: baseUrl, token } = settings;

  return (
    <AgreementsProvider baseUrl={baseUrl} token={token}>
      <Outlet />
    </AgreementsProvider>
  );
}
