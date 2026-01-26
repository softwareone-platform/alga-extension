import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useExtensionDetails } from "@features/extension";
import { RqlQuery } from "@swo/rql-client";
import {
  Subscription,
  SubscriptionListResponse,
  Order,
  OrderListResponse,
} from "@swo/mp-api-model";
import { backendClient } from "@/ui/lib/alga";
import { SWOListOptions } from "@/ui/features/shared";
import { PaginationMetadata } from "@swo/mp-api-model/billing";

const EMPTY_SUBSCRIPTIONS: Subscription[] = [];
const EMPTY_ORDERS: Order[] = [];
const EMPTY_PAGINATION: PaginationMetadata = {};

export type SubscriptionsClientSubscriptionsOptions =
  SWOListOptions<Subscription> & {
    licenseeId?: string;
  };

export type SubscriptionsClientOrdersOptions = SWOListOptions<Order>;

export const useSubscriptions = (
  options?: SubscriptionsClientSubscriptionsOptions,
  agreementIds?: string[],
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["subscriptions", options, agreementIds],
    queryFn: async () => {
      const { offset = 0, limit = 10, sort, licenseeId } = options || {};

      const query = new RqlQuery<Subscription>();

      query
        .expand(
          "id",
          "name",
          "agreement.id",
          "agreement.name",
          "product.id",
          "product.name",
          "product.icon",
          "licensee.id",
          "licensee.name",
          "agreement.id",
          "agreement.name",
          "price.SPxM",
          "price.SPxY",
          "price.currency",
          "terms.period",
          "terms.commitment",
          "status",
          "audit",
        )
        .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
        .paging(offset, limit);

      if (licenseeId)
        query.filter({
          field: "licensee.id",
          value: licenseeId,
          operator: "eq",
        });

      if (agreementIds)
        query.filter({
          field: "agreement.id",
          value: agreementIds,
          operator: "in",
        });

      const { data } = await backendClient.get<SubscriptionListResponse>(
        `/swo/commerce/subscriptions?${query.toString()}`,
      );

      return data;
    },
    enabled: isConfigured && (!agreementIds || agreementIds.length > 0),
    placeholderData: keepPreviousData,
  });

  const subscriptions = data?.data || EMPTY_SUBSCRIPTIONS;
  const pagination = data?.$meta?.pagination || EMPTY_PAGINATION;

  return { subscriptions, pagination, ...state };
};

export const useSubscription = (id: string) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data: subscription, ...state } = useQuery({
    queryKey: ["subscriptions", id],
    queryFn: async () => {
      const query = new RqlQuery<Subscription>();

      query.expand(
        "id",
        "name",
        "agreement.id",
        "agreement.name",
        "product.id",
        "product.name",
        "product.icon",
        "licensee.id",
        "licensee.name",
        "agreement.id",
        "agreement.name",
        "price.SPxM",
        "price.SPxY",
        "price.currency",
        "terms.period",
        "terms.commitment",
        "lines.id",
        "lines.item.id",
        "lines.item.name",
        "lines.item.unit.name",
        "lines.item.terms.period",
        "lines.item.terms.commitment",
        "lines.quantity",
        "lines.price.SPxM",
        "lines.price.SPxY",
        "lines.price.currency",
        "lines.price.unitSP",
        "lines.status",
        "status",
        "audit",
      );

      const { data } = await backendClient.get<Subscription>(
        `/swo/commerce/subscriptions/${id}?${query.toString()}`,
      );
      return data;
    },
    enabled: isConfigured && !!id,
  });

  return { subscription, ...state };
};

export const useSubscriptionOrders = (
  id: string,
  options?: SubscriptionsClientOrdersOptions,
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["subscriptions", id, "orders", options],
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
          "price.SPxM",
          "price.SPxY",
          "price.currency",
          "status",
          "audit",
        )
        .applyNamedFilter("group.buyers")
        .filter(
          query.operators.any("subscriptions" as any, {
            field: "id",
            value: id,
            operator: "eq",
          }),
        )
        .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
        .paging(offset, limit);

      const { data } = await backendClient.get<OrderListResponse>(
        `/swo/commerce/orders?${query.toString()}`,
      );
      return data;
    },
    enabled: isConfigured && !!id,
    placeholderData: keepPreviousData,
  });

  const orders = data?.data || EMPTY_ORDERS;
  const pagination = data?.$meta?.pagination || EMPTY_PAGINATION;

  return { orders, pagination, ...state };
};
