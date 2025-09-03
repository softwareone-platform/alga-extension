import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Agreements, Agreement } from "./agreements/index.ts";
import { Settings } from "./settings";
import { AgreementsLayout } from "./agreements/layout.tsx";
import "./index.css";

const BASE_URL = "https://portal.s1.live/public/v1/";
// const TOKEN =
//   "idt:TKN-3140-4844:hUOoIJsnPNBU4MeruvvLDjcYMboih3al2WXyEnY4IeTpZCF1xhex7p1qNPZVCD4b";

const TOKEN = "";

export function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
