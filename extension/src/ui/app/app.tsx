import { Link, NavLink, Outlet, useNavigate } from "react-router";
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
import { Tabs } from "@ui/tabs";

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
    <>
      <Tabs>
        <NavLink to="/msp/agreements">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>Agreements</Tabs.Tab>
          )}
        </NavLink>
        <NavLink to="/msp/subscriptions">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>Subscriptions</Tabs.Tab>
          )}
        </NavLink>
        <NavLink to="/msp/orders">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Orders</Tabs.Tab>}
        </NavLink>
        <NavLink to="/msp/statements">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>Statements</Tabs.Tab>
          )}
        </NavLink>
        <NavLink to="/msp/settings/general">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Settings</Tabs.Tab>}
        </NavLink>
      </Tabs>
      {/* <Link to="/consumer/orders">Orders</Link>
        <Link to="/consumer/statements">Statements</Link>
        <Link to="/consumer/subscriptions">Subscriptions</Link>
        <Link to="/consumer/agreements">Agreements</Link>
        <Link to="/consumer/orders">Orders</Link>
        <Link to="/consumer/statements">Statements</Link>
        <Link to="/consumer/subscriptions">Subscriptions</Link>
        <Link to="/consumer/agreements">Agreements</Link> */}
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
    </>
  );
}
