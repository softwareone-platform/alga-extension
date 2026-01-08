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

//idt:TKN-3140-4844:hUOoIJsnPNBU4MeruvvLDjcYMboih3al2WXyEnY4IeTpZCF1xhex7p1qNPZVCD4b
//idt:TKN-2515-5802:gcOsB36nFewgcEXVStNz6n9QsfzPz5nkZaNVW0WWl1VBjTttwUYEBFn8kA9lmnnc
//idt:TKN-3610-0872:IzD4V5gC9T6dBmpMWrZ60eIkzzbzb9OjliIWdrA2Xs2IXU4umyY0e62x7NHOhRgx

//idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR

// console.log(ALGA_API_URL, ALGA_API_KEY);

//https://portal.s1.live/commerce/subscriptions/SUB-5390-6511-9769

// (async () => {
//   const eid = window.location.host.split(".")[0];
//   try {
//     const url = `/api/ext/${eid}/handler`;
//     const res = await fetch(url);
//     const data = await res.json();

//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// })();

backendClient.get<UserResponseBody>("/user").then(({ data: { userType } }) => {
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
