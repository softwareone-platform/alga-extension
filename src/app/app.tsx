import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Agreements, Agreement, AgreementsLayout } from "./agreements";
import { Settings, SettingsProvider } from "./settings";

// const TOKEN =
//   "idt:TKN-3140-4844:hUOoIJsnPNBU4MeruvvLDjcYMboih3al2WXyEnY4IeTpZCF1xhex7p1qNPZVCD4b";

export function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/agreements" replace />} />
          <Route path="settings" element={<Settings />} />

          <Route path="agreements">
            <Route element={<AgreementsLayout />}>
              <Route index element={<Agreements />} />
              <Route path=":id" element={<Agreement />} />
            </Route>
          </Route>
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  );
}
