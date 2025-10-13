import { Navigate, RouteObject } from "react-router";
import {
  Agreements,
  Agreement,
  AgreementsLayout,
  Subscriptions as AgreementSubscriptions,
  Orders,
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
                    element: <Navigate to="subscriptions" replace />,
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
