import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { ConsumersProvider } from "@features/consumers";
import { ServicesProvider } from "@features/services";
import { useExtensionDetails } from "@features/extension";
import { ALGA_API_URL, ALGA_API_KEY } from "../config";

export function App() {
  const { details, isPending } = useExtensionDetails();

  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (!details?.hasToken || !details?.endpoint) {
      navigate("/start/settings", { replace: true });
    }
  }, [details, isPending]);

  if (isPending) return <></>;

  return (
    <ConsumersProvider baseUrl={ALGA_API_URL} apiKey={ALGA_API_KEY}>
      <ServicesProvider baseUrl={ALGA_API_URL} apiKey={ALGA_API_KEY}>
        <Outlet />
      </ServicesProvider>
    </ConsumersProvider>
  );
}
