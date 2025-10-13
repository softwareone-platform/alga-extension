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
import { Settings, General, Details as SettingsDetails } from "./settings";
import {
  Statements,
  StatementsLayout,
  Statement,
  Charges,
  Details as StatementDetails,
} from "./statements";
import {
  Orders as AllOrders,
  OrdersLayout,
  Order,
  Items,
  Details as OrderDetails,
} from "./orders";
import {
  Subscriptions as AllSubscriptions,
  SubscriptionsLayout,
  Subscription,
  Items as SubscriptionItems,
  Orders as SubscriptionOrders,
  Details as SubscriptionDetails,
} from "./subscriptions";

export const mspRoutes: RouteObject[] = [
  {
    path: "/msp",
    children: [
      {
        index: true,
        element: <Navigate to="agreements" replace />,
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />,
          },
          {
            path: "general",
            element: <General />,
          },
          {
            path: "details",
            element: <SettingsDetails />,
          },
        ],
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
      {
        path: "statements",
        children: [
          {
            element: <StatementsLayout />,
            children: [
              {
                index: true,
                element: <Statements />,
              },
              {
                path: ":id",
                element: <Statement />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="charges" replace />,
                  },
                  {
                    path: "charges",
                    element: <Charges />,
                  },
                  {
                    path: "details",
                    element: <StatementDetails />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            element: <OrdersLayout />,
            children: [
              {
                index: true,
                element: <AllOrders />,
              },
              {
                path: ":id",
                element: <Order />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="items" replace />,
                  },
                  {
                    path: "items",
                    element: <Items />,
                  },
                  {
                    path: "details",
                    element: <OrderDetails />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "subscriptions",
        children: [
          {
            element: <SubscriptionsLayout />,
            children: [
              {
                index: true,
                element: <AllSubscriptions />,
              },
              {
                path: ":id",
                element: <Subscription />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="items" replace />,
                  },
                  {
                    path: "items",
                    element: <SubscriptionItems />,
                  },
                  {
                    path: "orders",
                    element: <SubscriptionOrders />,
                  },
                  {
                    path: "details",
                    element: <SubscriptionDetails />,
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
