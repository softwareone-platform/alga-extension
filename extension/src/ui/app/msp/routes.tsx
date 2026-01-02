import { Navigate, RouteObject } from "react-router";
import {
  Agreement,
  SoftwareOne,
  Subscriptions as AgreementSubscriptions,
  Orders as AgreementOrders,
  Consumer,
  Billing,
  Details as AgreementDetails,
} from "./agreements";
import {
  Subscription,
  Items as SubscriptionItems,
  Orders as SubscriptionOrders,
  Details as SubscriptionDetails,
} from "./subscriptions";
import { Order, Items, Details as OrderDetails } from "./orders";
import { Statement, Charges, Details as StatementDetails } from "./statements";
import {
  Agreements,
  Orders,
  Settings,
  Start,
  Statements,
  Subscriptions,
} from "./start";

export const mspRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="start" replace />,
  },
  {
    path: "start",
    element: <Start />,
    children: [
      {
        index: true,
        element: <Navigate to="agreements" replace />,
      },
      {
        path: "agreements",
        element: <Agreements />,
      },
      {
        path: "subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "statements",
        element: <Statements />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "agreements/:id",
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
        element: <AgreementOrders />,
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
  {
    path: "subscriptions/:id",
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
  {
    path: "orders/:id",
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
  {
    path: "statements/:id",
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
];
