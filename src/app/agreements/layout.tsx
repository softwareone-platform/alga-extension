import { Outlet } from "react-router";
import { AgreementsProvider } from "@features/agreements";
import { useExtensionDetails } from "@features/extension";

export function AgreementsLayout() {
  const { details } = useExtensionDetails();

  return (
    <AgreementsProvider baseUrl={details?.endpoint} token={details?.token}>
      <Outlet />
    </AgreementsProvider>
  );
}
