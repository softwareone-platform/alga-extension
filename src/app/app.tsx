import { Navigate, Route, Routes, useNavigate } from "react-router";
import {
  Agreements,
  Agreement,
  AgreementsLayout,
  SoftwareOne,
} from "./agreements";
import { Settings, General, Details } from "./settings";
import { AccountProvider } from "@features/account";
import { useExtensionDetails } from "@features/extension";
import { UserProvider } from "@features/user";
import { useEffect } from "react";

//idt:TKN-3140-4844:hUOoIJsnPNBU4MeruvvLDjcYMboih3al2WXyEnY4IeTpZCF1xhex7p1qNPZVCD4b

//idt:TKN-2515-5802:gcOsB36nFewgcEXVStNz6n9QsfzPz5nkZaNVW0WWl1VBjTttwUYEBFn8kA9lmnnc

export function App() {
  const { details, isPlaceholderData } = useExtensionDetails();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPlaceholderData) return;
    if (!details.token || !details.endpoint)
      navigate("/settings/general", { replace: true });
  }, [details]);

  if (isPlaceholderData) return <></>;

  return (
    <AccountProvider baseUrl={details.endpoint} token={details.token}>
      <UserProvider baseUrl={details.endpoint} token={details.token}>
        <Routes>
          <Route path="/" element={<Navigate to="/agreements" replace />} />

          <Route path="settings" element={<Settings />}>
            <Route
              index
              element={<Navigate to="/settings/general" replace />}
            />
            <Route path="general" element={<General />} />
            <Route path="details" element={<Details />} />
          </Route>

          <Route path="agreements">
            <Route element={<AgreementsLayout />}>
              <Route index element={<Agreements />} />
              <Route path=":id" element={<Agreement />}>
                <Route
                  index
                  element={
                    <Navigate to="/agreements/:id/softwareone" replace />
                  }
                />
                <Route path="softwareone" element={<SoftwareOne />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </AccountProvider>
  );
}
