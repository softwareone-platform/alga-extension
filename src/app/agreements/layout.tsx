import { Outlet } from "react-router";
import {
  SWOAgreementsProvider,
  AlgaAgreementsProvider,
} from "@features/agreements";
import { useExtensionDetails } from "@features/extension";
import { KVStorage } from "@lib/alga";

const kvStorage = new KVStorage("swo:agreements");

export function AgreementsLayout() {
  const { details } = useExtensionDetails();

  return (
    <SWOAgreementsProvider baseUrl={details?.endpoint} token={details?.token}>
      <AlgaAgreementsProvider kvStorage={kvStorage}>
        <Outlet />
      </AlgaAgreementsProvider>
    </SWOAgreementsProvider>
  );
}
