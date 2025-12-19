import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useExtensionDetails } from "@features/extension";
import { RqlQuery } from "@swo/rql-client";
import { Order, OrderListResponse } from "@swo/mp-api-model";
import { backendClient } from "@/ui/lib/alga";
import { SWOListOptions } from "@/ui/features/shared";

export type OrdersClientOrdersOptions = SWOListOptions<Order> & {
  licenseeId?: string;
};

export const useOrders = (
  options?: SWOListOptions<Order>,
  agreementIds?: string[]
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["orders", options, agreementIds],
    queryFn: async () => {
      const { offset = 0, limit = 10, sort } = options || {};

      const query = new RqlQuery<Order>();

      query
        .expand(
          "id",
          "type",
          "agreement.id",
          "agreement.name",
          "product.id",
          "product.name",
          "product.icon",
          "licensee.id",
          "licensee.name",
          "price.currency",
          "price.SPxY",
          "audit",
          "status"
        )
        .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
        .paging(offset, limit);

      if (agreementIds)
        query.filter({
          field: "agreement.id",
          value: agreementIds,
          operator: "in",
        });

      const { data } = await backendClient.get<OrderListResponse>(
        `/swo/commerce/orders?${query.toString()}`
      );
      return data;
    },
    enabled: isConfigured && (!agreementIds || agreementIds.length > 0),
    placeholderData: keepPreviousData,
  });

  const orders = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { orders, pagination, ...state };
};

export const useOrder = (id: string) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data: order, ...state } = useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const query = new RqlQuery<Order>();

      query.expand(
        "id",
        "type",
        "agreement.id",
        "agreement.name",
        "product.id",
        "product.name",
        "product.icon",
        "licensee.id",
        "licensee.name",
        "price.currency",
        "price.SPxM",
        "price.SPxY",
        "audit",
        "status",
        "lines.item.id",
        "lines.item.name",
        "lines.quantity",
        "lines.item.unit.name",
        "lines.item.terms.period",
        "lines.price.SPxM",
        "lines.price.SPxY",
        "lines.price.currency",
        "lines.item.status"
      );

      const { data } = await backendClient.get<Order>(
        `/swo/commerce/orders/${id}?${query.toString()}`
      );

      return data;
    },
    enabled: isConfigured && !!id,
  });

  return { order, ...state };
};
