import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { useExtensionDetails } from "@features/extension";
import { RqlQuery } from "@swo/rql-client";
import {
  Subscription,
  SubscriptionListResponse,
  Order,
  OrderListResponse,
  AgreementLine,
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
    enabled: !!id,
  });

  return { subscription, ...state };
};

export const useSubscriptionOrders = (
  id: string,
  options?: SubscriptionsClientOrdersOptions,
) => {
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
    enabled: !!id,
    placeholderData: keepPreviousData,
  });

  const orders = data?.data || EMPTY_ORDERS;
  const pagination = data?.$meta?.pagination || EMPTY_PAGINATION;

  return { orders, pagination, ...state };
};

export const useSubscriptionUpdate = (subscription: Subscription) => {
  const {
    mutate: updateSubscription,
    mutateAsync: updateSubscriptionAsync,
    ...state
  } = useMutation({
    mutationFn: async (lines: AgreementLine[]) => {
      if (!subscription.agreement?.id || !subscription.id) {
        throw new Error("Subscription or agreement not found");
      }

      const {
        data: { id: orderId },
      } = await backendClient.post<Order>(`/swo/commerce/orders`, {
        status: "Draft",
        type: "Change",
        agreement: {
          id: subscription.agreement.id,
        },
        subscriptions: [
          {
            id: subscription.id,
          },
        ],
      });

      if (!orderId) {
        throw new Error("Failed to create order");
      }

      const {
        data: { lines: newLines },
      } = await backendClient.put<Order>(`/swo/commerce/orders/${orderId}`, {
        lines,
      });

      if (!newLines) {
        throw new Error("Failed to update order");
      }

      //https://portal.s1.live/public/v1/commerce/orders/ORD-8150-9866-7724/process

      const { data: order } = await backendClient.post<Order>(
        `/swo/commerce/orders/${orderId}/process`,
        {
          lines: newLines,
        },
      );

      return order;
    },
  });

  return { updateSubscription, updateSubscriptionAsync, ...state };
};
