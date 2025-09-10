import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./app";
import { ExtensionProvider } from "@features/extension";
import { BrowserRouter } from "react-router";
import { KVStorage } from "@lib/alga";
import { KVStorageProvider } from "@features/kv-storage";

import "./index.css";
import "@alga-psa/ui-kit/theme.css";

//idt:TKN-3140-4844:hUOoIJsnPNBU4MeruvvLDjcYMboih3al2WXyEnY4IeTpZCF1xhex7p1qNPZVCD4b
//idt:TKN-2515-5802:gcOsB36nFewgcEXVStNz6n9QsfzPz5nkZaNVW0WWl1VBjTttwUYEBFn8kA9lmnnc

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
