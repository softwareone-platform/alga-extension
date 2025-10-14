import { Outlet } from "react-router";
import { useExtensionDetails } from "@features/extension";
import { OrdersProvider } from "@features/orders";

export function OrdersLayout() {
  const { details } = useExtensionDetails();

  return (
    <OrdersProvider baseUrl={details?.endpoint} token={details?.token}>
      <Outlet />
    </OrdersProvider>
  );
}
