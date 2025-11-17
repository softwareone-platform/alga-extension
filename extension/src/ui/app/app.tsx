import { Outlet, useNavigate } from "react-router";
import { AccountProvider } from "@features/account";
import { useExtensionDetails } from "@features/extension";
import { UserProvider } from "@features/user";
import { useEffect, useRef } from "react";
import { runIFrame } from "@lib/swo-navigation";
import { KVStorage } from "@lib/alga";
import { BillingConfigsProvider } from "@features/billing-config";
import { ConsumersProvider } from "@features/consumers";
import { ServicesProvider } from "@features/services";
import { ALGA_API_URL, ALGA_API_KEY } from "../config";

const kvStorage = new KVStorage(ALGA_API_URL, ALGA_API_KEY, "billing-configs");

// (async () => {
//   const eid = window.location.host.split(".")[0];
//   try {
//     const url = `/api/ext/${eid}/handler`;
//     const res = await fetch(url);
//     const data = await res.json();

//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// })();

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
              <Outlet />
            </ServicesProvider>
          </ConsumersProvider>
        </BillingConfigsProvider>
      </UserProvider>
    </AccountProvider>
  );
}
