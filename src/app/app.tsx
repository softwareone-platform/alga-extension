import { Navigate, Route, Routes, useNavigate } from "react-router";
import {
  Agreements,
  Agreement,
  AgreementsLayout,
  SoftwareOne,
  Subscriptions,
  Orders,
  Consumer,
  Billing,
  Details as AgreementDetails,
} from "./agreements";
import { Settings, General, Details } from "./settings";
import { AccountProvider } from "@features/account";
import { useExtensionDetails } from "@features/extension";
import { UserProvider } from "@features/user";
import { useEffect, useRef } from "react";
import { runIFrame } from "@lib/swo-navigation";
import { Statements, StatementsLayout } from "./statements";
import { KVStorage } from "@lib/alga";
import { BillingConfigsProvider } from "@features/billing-config";
import { Statement, Charges } from "./statements/statement";

const kvStorage = new KVStorage("swo:billing-configs");

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
          <Routes>
            <Route path="/" element={<Navigate to="/agreements" replace />} />

            <Route path="settings" element={<Settings />}>
              <Route index element={<Navigate to="general" replace />} />
              <Route path="general" element={<General />} />
              <Route path="details" element={<Details />} />
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
                  <Route path="subscriptions" element={<Subscriptions />} />
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
                </Route>
              </Route>
            </Route>
          </Routes>
        </BillingConfigsProvider>
      </UserProvider>
    </AccountProvider>
  );
}
