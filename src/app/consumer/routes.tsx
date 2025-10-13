import { Navigate, RouteObject } from "react-router";
import {
  Agreements,
  Agreement,
  AgreementsLayout,
  SoftwareOne,
  Subscriptions as AgreementSubscriptions,
  Orders,
  Consumer,
  Billing,
  Details as AgreementDetails,
} from "./agreements";

export const consumerRoutes: RouteObject[] = [
  {
    path: "/consumer",
    children: [
      {
        index: true,
        element: <Navigate to="agreements" replace />,
      },
      {
        path: "agreements",
        children: [
          {
            element: <AgreementsLayout />,
            children: [
              {
                index: true,
                element: <Agreements />,
              },
              {
                path: ":id",
                element: <Agreement />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="softwareone" replace />,
                  },
                  {
                    path: "softwareone",
                    element: <SoftwareOne />,
                  },
                  {
                    path: "subscriptions",
                    element: <AgreementSubscriptions />,
                  },
                  {
                    path: "orders",
                    element: <Orders />,
                  },
                  {
                    path: "consumer",
                    element: <Consumer />,
                  },
                  {
                    path: "billing",
                    element: <Billing />,
                  },
                  {
                    path: "details",
                    element: <AgreementDetails />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
