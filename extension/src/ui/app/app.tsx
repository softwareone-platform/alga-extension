import { Outlet, useNavigate } from "react-router";
import { AccountProvider } from "@features/account";
import { UserProvider } from "@features/user";
import { useEffect, useRef } from "react";
import { runIFrame } from "@lib/swo-navigation";
import { BillingConfigsProvider } from "@features/billing-config";
import { ConsumersProvider } from "@features/consumers";
import { ServicesProvider } from "@features/services";
import { AgreementsProvider } from "@features/agreements";
import { useExtensionDetails } from "@features/extension";
import { OrdersProvider } from "@features/orders";
import { StatementsProvider } from "@features/statements";
import { SubscriptionsProvider } from "@features/subscriptions";

export function App() {
  const { details, isPending } = useExtensionDetails();
  const isReady = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (window.top === window || !window.top || isReady.current) return;
    isReady.current = true;

    runIFrame(window.top, window);
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!details?.token || !details?.endpoint) {
      navigate("/msp/start/settings", { replace: true });
    }
  }, [details, isPending, navigate]);

  if (isPending) return <></>;

  return (
    <AccountProvider>
      <UserProvider>
        <BillingConfigsProvider>
          <ConsumersProvider>
            <ServicesProvider>
              <AgreementsProvider>
                <OrdersProvider>
                  <StatementsProvider>
                    <SubscriptionsProvider>
                      <Outlet />
                    </SubscriptionsProvider>
                  </StatementsProvider>
                </OrdersProvider>
              </AgreementsProvider>
            </ServicesProvider>
          </ConsumersProvider>
        </BillingConfigsProvider>
      </UserProvider>
    </AccountProvider>
  );
}
