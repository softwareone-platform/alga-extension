import { Outlet, useNavigate } from "react-router";
import { AccountProvider } from "@features/account";
import { UserProvider } from "@features/user";
import { useCallback, useEffect, useRef } from "react";
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

function resolveHostOrigin() {
  const referrer = document.referrer;
  if (referrer) {
    try {
      return new URL(referrer).origin;
    } catch {
      // ignore invalid referrer
    }
  }

  try {
    if (window.parent && window.parent !== window && window.parent.location) {
      return window.parent.location.origin;
    }
  } catch {
    // cross-origin access throws
  }

  return window.location.origin;
}

function resolveExtensionId(searchParams: URLSearchParams) {
  const fromQuery = searchParams.get("extensionId");
  if (fromQuery && fromQuery !== "unknown") {
    return fromQuery;
  }

  const segments = window.location.pathname.split("/").filter(Boolean);
  const extUiIndex = segments.indexOf("ext-ui");
  if (extUiIndex >= 0 && segments[extUiIndex + 1]) {
    try {
      return decodeURIComponent(segments[extUiIndex + 1]);
    } catch {
      return segments[extUiIndex + 1];
    }
  }
  return null;
}

const EXT_ID = resolveExtensionId(new URLSearchParams(window.location.search));
console.log(EXT_ID);

export function App() {
  const { details, isPending } = useExtensionDetails();
  const isReady = useRef(false);

  const navigate = useNavigate();

  const testAlga = useCallback(async () => {
    const hostOrigin = resolveHostOrigin();
    const apiUrl = new URL(
      `/api/ext/${EXT_ID}/swo/accounts/accounts`,
      hostOrigin
    );

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      mode: "cors",
      credentials: "include",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
    </AccountProvider>
  );
}
