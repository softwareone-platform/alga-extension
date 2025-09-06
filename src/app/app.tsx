import { Navigate, Route, Routes, useNavigate } from "react-router";
import { Agreements, Agreement, AgreementsLayout } from "./agreements";
import { SettingsLayout, General, Details, Settings } from "./settings";
import { AccountProvider } from "@features/account";
import { useExtension } from "@features/extension";
import { UserProvider } from "@features/user";
import { useEffect } from "react";

// const TOKEN =
//   "idt:TKN-3140-4844:hUOoIJsnPNBU4MeruvvLDjcYMboih3al2WXyEnY4IeTpZCF1xhex7p1qNPZVCD4b";

export function App() {
  const { settings } = useExtension();
  const navigate = useNavigate();

  useEffect(() => {
    if (!settings.token || !settings.endpoint) {
      navigate("/settings/general", { replace: true });
    }
  }, [settings]);

  return (
    <AccountProvider baseUrl={settings.endpoint} token={settings.token}>
      <UserProvider baseUrl={settings.endpoint} token={settings.token}>
        <Routes>
          <Route path="/" element={<Navigate to="/agreements" replace />} />

          <Route path="settings" element={<SettingsLayout />}>
            <Route
              index
              element={<Navigate to="/settings/general" replace />}
            />
            <Route path="general" element={<General />} />
            <Route path="details" element={<Details />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="agreements">
            <Route element={<AgreementsLayout />}>
              <Route index element={<Agreements />} />
              <Route path=":id" element={<Agreement />} />
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </AccountProvider>
  );
}
