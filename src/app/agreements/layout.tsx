import { Outlet } from "react-router";
import { AgreementsProvider } from "@features/agreements";
import { useExtensionDetails } from "@features/extension";
import { KVStorage } from "@lib/alga";
import { BillingConfigsProvider } from "@features/billing-config";

const kvStorage = new KVStorage("swo:agreements");

export function AgreementsLayout() {
  const { details } = useExtensionDetails();

  return (
    <AgreementsProvider baseUrl={details?.endpoint} token={details?.token}>
      <BillingConfigsProvider kvStorage={kvStorage}>
        <Outlet />
      </BillingConfigsProvider>
    </AgreementsProvider>
  );
}
