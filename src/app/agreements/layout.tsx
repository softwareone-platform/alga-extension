import { Outlet } from "react-router";
import { AgreementsProvider } from "./_shared/agreements-context";
import { useExtensionDetails } from "@features/extension";

export function AgreementsLayout() {
  const { extensionSettings } = useExtensionDetails();

  return (
    <AgreementsProvider
      baseUrl={extensionSettings.endpoint}
      token={extensionSettings.token}
    >
      <Outlet />
    </AgreementsProvider>
  );
}
