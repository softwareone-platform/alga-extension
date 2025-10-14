import { Navigate, RouteObject } from "react-router";
import {
  Agreements,
  Agreement,
  AgreementsLayout,
  Subscriptions as AgreementSubscriptions,
  Orders,
  Details as AgreementDetails,
} from "./agreements";
import {
  Subscriptions as AllSubscriptions,
  SubscriptionsLayout,
  Subscription,
  Items as SubscriptionItems,
  Orders as SubscriptionOrders,
  Details as SubscriptionDetails,
} from "./subscriptions";
import {
  Orders as AllOrders,
  OrdersLayout,
  Order,
  Items,
  Details as OrderDetails,
} from "./orders";

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
    ],
  },
];
