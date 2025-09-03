import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AgreementsProvider } from "./contexts/agreements-context";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Agreements from "./agreements.tsx";
import Agreement from "./agreement.tsx";
import "./index.css";

const queryClient = new QueryClient();

const BASE_URL = "https://portal.s1.live/public/v1/";
const TOKEN =
  "idt:TKN-3140-4844:hUOoIJsnPNBU4MeruvvLDjcYMboih3al2WXyEnY4IeTpZCF1xhex7p1qNPZVCD4b";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AgreementsProvider baseUrl={BASE_URL} token={TOKEN}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/agreements" replace />} />

            <Route path="agreements">
              <Route index element={<Agreements />} />
              <Route path=":id" element={<Agreement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AgreementsProvider>
    </QueryClientProvider>
  </StrictMode>
);
