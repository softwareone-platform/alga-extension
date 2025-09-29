import { Outlet } from "react-router";
import { useExtensionDetails } from "@features/extension";
import { StatementsProvider } from "@features/statements";

export function StatementsLayout() {
  const { details } = useExtensionDetails();

  return (
    <StatementsProvider baseUrl={details?.endpoint} token={details?.token}>
      <Outlet />
    </StatementsProvider>
  );
}
