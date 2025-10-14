import { Outlet } from "react-router";
import { AgreementsProvider } from "@features/agreements";
import { useExtensionDetails } from "@features/extension";
import { OrdersProvider } from "@features/orders";
import { StatementsProvider } from "@features/statements";
import { SubscriptionsProvider } from "@features/subscriptions";

export function Layout() {
  const { details } = useExtensionDetails();

  return (
    <AgreementsProvider baseUrl={details?.endpoint} token={details?.token}>
      <OrdersProvider baseUrl={details?.endpoint} token={details?.token}>
        <StatementsProvider baseUrl={details?.endpoint} token={details?.token}>
          <SubscriptionsProvider
            baseUrl={details?.endpoint}
            token={details?.token}
          >
            <Outlet />
          </SubscriptionsProvider>
        </StatementsProvider>
      </OrdersProvider>
    </AgreementsProvider>
  );
}
