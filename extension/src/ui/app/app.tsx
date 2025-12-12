import { Outlet, useNavigate } from "react-router";
import { UserProvider } from "@features/user";
import { useCallback, useEffect, useRef } from "react";
import { runIFrame } from "@lib/swo-navigation";
import { backendClient, KVStorage } from "@lib/alga";
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

  const testAlga = useCallback(async () => {
    const response = await backendClient.get<any>(`/swo/accounts/accounts`);
    // const response = await fetch(`${ALGA_BACKEND_URL}/swo/accounts/accounts`, {
    //   method: "GET",
    //   mode: "cors",
    //   credentials: "include",
    //   cache: "no-cache",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    console.log(response);
  }, []);

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
  }, [details, isPending]);

  if (isPending) return <></>;

  return (
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
                    <button className="opacity-50" onClick={testAlga}>
                      Test Backend
                    </button>
                  </SubscriptionsProvider>
                </StatementsProvider>
              </OrdersProvider>
            </AgreementsProvider>
          </ServicesProvider>
        </ConsumersProvider>
      </BillingConfigsProvider>
    </UserProvider>
  );
}
