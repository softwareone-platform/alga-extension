import { Navigate, Route, Routes, useNavigate } from "react-router";
import {
  Agreements,
  Agreement,
  AgreementsLayout,
  SoftwareOne,
  Subscriptions as AgreementSubscriptions,
  Orders,
  Consumer,
  Billing,
  Details as AgreementDetails,
} from "./msp/agreements";
import { Settings, General, Details as SettingsDetails } from "./msp/settings";
import { AccountProvider } from "@features/account";
import { useExtensionDetails } from "@features/extension";
import { UserProvider } from "@features/user";
import { useEffect, useRef } from "react";
import { runIFrame } from "@lib/swo-navigation";
import {
  Statements,
  StatementsLayout,
  Statement,
  Charges,
  Details as StatementDetails,
} from "./msp/statements";
import {
  Orders as AllOrders,
  OrdersLayout,
  Order,
  Items,
  Details as OrderDetails,
} from "./msp/orders";
import {
  Subscriptions as AllSubscriptions,
  SubscriptionsLayout,
  Subscription,
  Items as SubscriptionItems,
  Orders as SubscriptionOrders,
  Details as SubscriptionDetails,
} from "./msp/subscriptions";
import { KVStorage } from "@lib/alga";
import { BillingConfigsProvider } from "@features/billing-config";
import { ConsumersProvider } from "@features/consumers";

const kvStorage = new KVStorage("swo:billing-configs");
const BASE_URL = "http://localhost:8010/proxy/api/v1/";
const API_KEY =
  "200aebbceb58e17579c1da81754116d236d1a14872f34f755694e84d3d044518";

export function App() {
  const { details, isPending } = useExtensionDetails();
  const navigate = useNavigate();
  const isReady = useRef(false);

  useEffect(() => {
    if (window.top === window || !window.top || isReady.current) return;
    isReady.current = true;

    runIFrame(window.top, window);
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!details?.token || !details?.endpoint)
      navigate("/settings/general", { replace: true });
  }, [details]);

  if (isPending) return <></>;

  return (
    <AccountProvider baseUrl={details?.endpoint} token={details?.token}>
      <UserProvider baseUrl={details?.endpoint} token={details?.token}>
        <BillingConfigsProvider kvStorage={kvStorage}>
          <ConsumersProvider baseUrl={BASE_URL} apiKey={API_KEY}>
            <Routes>
              <Route path="/" element={<Navigate to="/agreements" replace />} />

              <Route path="settings" element={<Settings />}>
                <Route index element={<Navigate to="general" replace />} />
                <Route path="general" element={<General />} />
                <Route path="details" element={<SettingsDetails />} />
              </Route>

              <Route path="agreements">
                <Route element={<AgreementsLayout />}>
                  <Route index element={<Agreements />} />
                  <Route path=":id" element={<Agreement />}>
                    <Route
                      index
                      element={<Navigate to="softwareone" replace />}
                    />
                    <Route path="softwareone" element={<SoftwareOne />} />
                    <Route
                      path="subscriptions"
                      element={<AgreementSubscriptions />}
                    />
                    <Route path="orders" element={<Orders />} />
                    <Route path="consumer" element={<Consumer />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="details" element={<AgreementDetails />} />
                  </Route>
                </Route>
              </Route>
              <Route path="statements">
                <Route element={<StatementsLayout />}>
                  <Route index element={<Statements />} />
                  <Route path=":id" element={<Statement />}>
                    <Route index element={<Navigate to="charges" replace />} />
                    <Route path="charges" element={<Charges />} />
                    <Route path="details" element={<StatementDetails />} />
                  </Route>
                </Route>
              </Route>
              <Route path="orders">
                <Route element={<OrdersLayout />}>
                  <Route index element={<AllOrders />} />
                  <Route path=":id" element={<Order />}>
                    <Route index element={<Navigate to="items" replace />} />
                    <Route path="items" element={<Items />} />
                    <Route path="details" element={<OrderDetails />} />
                  </Route>
                </Route>
              </Route>
              <Route path="subscriptions">
                <Route element={<SubscriptionsLayout />}>
                  <Route index element={<AllSubscriptions />} />
                  <Route path=":id" element={<Subscription />}>
                    <Route index element={<Navigate to="items" replace />} />
                    <Route path="items" element={<SubscriptionItems />} />
                    <Route path="orders" element={<SubscriptionOrders />} />
                    <Route path="details" element={<SubscriptionDetails />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </ConsumersProvider>
        </BillingConfigsProvider>
      </UserProvider>
    </AccountProvider>
  );
}
