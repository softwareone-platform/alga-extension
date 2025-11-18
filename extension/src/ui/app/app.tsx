import { Outlet, useNavigate } from "react-router";
import { AccountProvider } from "@features/account";
import { UserProvider } from "@features/user";
import { useEffect, useRef } from "react";
import { runIFrame } from "@lib/swo-navigation";
import { KVStorage } from "@lib/alga";
import { BillingConfigsProvider } from "@features/billing-config";
import { ConsumersProvider } from "@features/consumers";
import { ServicesProvider } from "@features/services";
import { AgreementsProvider } from "@features/agreements";
import { useExtensionDetails } from "@features/extension";
import { OrdersProvider } from "@features/orders";
import { StatementsProvider } from "@features/statements";
import { SubscriptionsProvider } from "@features/subscriptions";
import { ALGA_API_URL, ALGA_API_KEY } from "../config";

const kvStorage = new KVStorage(ALGA_API_URL, ALGA_API_KEY, "billing-configs");

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
      navigate("/msp/settings/general", { replace: true });
    }
  }, [details, isPending]);

  if (isPending) return <></>;

  return (
    <AccountProvider baseUrl={details?.endpoint} token={details?.token}>
      <UserProvider baseUrl={details?.endpoint} token={details?.token}>
        <BillingConfigsProvider kvStorage={kvStorage}>
          <ConsumersProvider baseUrl={ALGA_API_URL} apiKey={ALGA_API_KEY}>
            <ServicesProvider baseUrl={ALGA_API_URL} apiKey={ALGA_API_KEY}>
              <AgreementsProvider
                baseUrl={details?.endpoint}
                token={details?.token}
              >
                <OrdersProvider
                  baseUrl={details?.endpoint}
                  token={details?.token}
                >
                  <StatementsProvider
                    baseUrl={details?.endpoint}
                    token={details?.token}
                  >
                    <SubscriptionsProvider
                      baseUrl={details?.endpoint}
                      token={details?.token}
                    >
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
