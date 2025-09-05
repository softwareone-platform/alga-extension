import { Outlet } from "react-router";
import { AgreementsProvider } from "./_shared/agreements-context";
import { useSettings } from "@features/settings";

export function AgreementsLayout() {
  const { settings } = useSettings();
  const { endpoint: baseUrl, token } = settings;

  return (
    <AgreementsProvider baseUrl={baseUrl} token={token}>
      <Outlet />
    </AgreementsProvider>
  );
}
