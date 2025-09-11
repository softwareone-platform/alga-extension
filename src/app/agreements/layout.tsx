import { Outlet } from "react-router";
import { AgreementsProvider } from "@features/agreements";
import { useExtensionDetails } from "@features/extension";
import { KVStorage } from "@lib/alga";

const kvStorage = new KVStorage("swo:agreements");

export function AgreementsLayout() {
  const { details } = useExtensionDetails();

  return (
    <AgreementsProvider
      kvStorage={kvStorage}
      baseUrl={details?.endpoint}
      token={details?.token}
    >
      <Outlet />
    </AgreementsProvider>
  );
}
