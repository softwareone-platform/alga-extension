import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./app";
import { ExtensionProvider } from "@features/extension";
import { BrowserRouter } from "react-router";
import { KVStorage } from "@lib/alga";

import "./index.css";
import "@alga-psa/ui-kit/theme.css";
import { KVStorageProvider } from "@features/kv-storage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

const kvStorage = new KVStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <KVStorageProvider storage={kvStorage}>
        <ExtensionProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ExtensionProvider>
      </KVStorageProvider>
    </QueryClientProvider>
  </StrictMode>
);
