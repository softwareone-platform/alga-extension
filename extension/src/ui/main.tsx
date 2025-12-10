import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ExtensionProvider } from "@features/extension";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ProxyBridgeProvider, createBridge } from "@lib/proxy";

import { App } from "./app";
import { mspRoutes } from "./app/msp";
import { consumerRoutes } from "./app/consumer";

import "./ready-inject.js";
import "./index.css";
import "@alga-psa/ui-kit/theme.css";

// Initialize the proxy bridge
const bridge = createBridge();
bridge.ready();

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...mspRoutes,
      ...consumerRoutes,
      {
        index: true,
        element: <Navigate to="/msp/start" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ProxyBridgeProvider uiProxy={bridge.uiProxy}>
        <ExtensionProvider>
          <RouterProvider router={router} />
        </ExtensionProvider>
      </ProxyBridgeProvider>
    </QueryClientProvider>
  </StrictMode>
);
