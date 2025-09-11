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
import { useEffect } from "react";

export function App() {
  const { details, isPending } = useExtensionDetails();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (!details?.token || !details?.endpoint)
      navigate("/settings/general", { replace: true });
  }, [details]);

  if (isPending) return <></>;

  return (
    <AccountProvider baseUrl={details?.endpoint} token={details?.token}>
      <UserProvider baseUrl={details?.endpoint} token={details?.token}>
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
                <Route index element={<Navigate to="softwareone" replace />} />
                <Route path="softwareone" element={<SoftwareOne />} />
                <Route path="subscriptions" element={<Subscriptions />} />
                <Route path="orders" element={<Orders />} />
                <Route path="consumer" element={<Consumer />} />
                <Route path="billing" element={<Billing />} />
                <Route path="details" element={<AgreementDetails />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </AccountProvider>
  );
}
