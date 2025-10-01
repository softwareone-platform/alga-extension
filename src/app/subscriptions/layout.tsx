import { Outlet } from "react-router";
import { useExtensionDetails } from "@features/extension";
import { SubscriptionsProvider } from "@features/subscriptions";

export function SubscriptionsLayout() {
  const { details } = useExtensionDetails();

  return (
    <SubscriptionsProvider baseUrl={details?.endpoint} token={details?.token}>
      <Outlet />
    </SubscriptionsProvider>
  );
}
