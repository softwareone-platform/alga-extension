import { Outlet } from "react-router";
import { AgreementsProvider } from "./agreements-context";
import { useSettings } from "../settings";

export function AgreementsLayout() {
  const { settings } = useSettings();
  console.log(settings);
  return (
    <AgreementsProvider baseUrl={settings.endpoint} token={settings.token}>
      <Outlet />
    </AgreementsProvider>
  );
}
