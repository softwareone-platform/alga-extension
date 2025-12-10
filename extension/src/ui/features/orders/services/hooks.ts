import { useContext } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { OrdersContext } from "./context";
import { OrdersClientOrdersOptions } from "@lib/swo-proxy";

export const useOrders = (
  options?: OrdersClientOrdersOptions,
  agreementIds?: string[]
) => {
  const { client } = useContext(OrdersContext);

  const { data, ...state } = useQuery({
    queryKey: ["orders", options],
    queryFn: () => client!.getOrders(options, agreementIds),
    enabled: !!client && (!agreementIds || agreementIds.length > 0),
    placeholderData: keepPreviousData,
  });

  const orders = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { orders, pagination, ...state };
};

export const useOrder = (id: string) => {
  const { client } = useContext(OrdersContext);

  const { data: order, ...state } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => client!.getOrder(id),
    enabled: !!client,
  });

  return { order, ...state };
};
