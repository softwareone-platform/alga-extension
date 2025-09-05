import { Outlet } from "react-router";
import { AgreementsProvider } from "./_shared/agreements-context";

export function AgreementsLayout() {
  return (
    <AgreementsProvider>
      <Outlet />
    </AgreementsProvider>
  );
}
