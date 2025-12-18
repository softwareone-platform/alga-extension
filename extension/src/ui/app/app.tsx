import { Outlet, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { runIFrame } from "@lib/swo-navigation";
import { KVStorage } from "@lib/alga";
import { BillingConfigsProvider } from "@features/billing-config";
import { ConsumersProvider } from "@features/consumers";
import { ServicesProvider } from "@features/services";
import { useExtensionDetails } from "@features/extension";
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
      navigate("/msp/start/settings", { replace: true });
    }
  }, [details, isPending]);

  if (isPending) return <></>;

  return (
    <BillingConfigsProvider kvStorage={kvStorage}>
      <ConsumersProvider baseUrl={ALGA_API_URL} apiKey={ALGA_API_KEY}>
        <ServicesProvider baseUrl={ALGA_API_URL} apiKey={ALGA_API_KEY}>
          <Outlet />
        </ServicesProvider>
      </ConsumersProvider>
    </BillingConfigsProvider>
  );
}
