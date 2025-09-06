import { Outlet } from "react-router";
import { AgreementsProvider } from "./_shared/agreements-context";
import { useExtensionSettings } from "@features/extension";

export function AgreementsLayout() {
  const { extensionSettings } = useExtensionSettings();

  return (
    <AgreementsProvider
      baseUrl={extensionSettings.endpoint}
      token={extensionSettings.token}
    >
      <Outlet />
    </AgreementsProvider>
  );
}
