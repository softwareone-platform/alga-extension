import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";

import { App } from "./app";
import { mspRoutes } from "./app/msp";
import { clientRoutes } from "./app/client";

import "./ready-inject.js";
import "./index.css";
import "@alga-psa/ui-kit/theme.css";

import { backendClient } from "./lib/alga/url.js";
import { UserResponseBody } from "@/shared/user";

// import { IframeBridge } from "@alga-psa/extension-iframe-sdk";

// const bridge = new IframeBridge({ devAllowWildcard: true });

// export async function proxyGet<T>(route: string): Promise<T> {
//   const bytes = await bridge.uiProxy.callRoute(route);
//   const text = new TextDecoder().decode(bytes);
//   return text ? JSON.parse(text) : ({} as T);
// }

// proxyGet<UserResponseBody>("/user").then(({ userType }) => {
//   console.log("From backend", userType);
// });


backendClient.get<UserResponseBody>("/user").then(({ data: { userType } }) => {
  console.log("From proxy", userType);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: userType === "internal" ? mspRoutes : clientRoutes,
    },
  ]);

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

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
});