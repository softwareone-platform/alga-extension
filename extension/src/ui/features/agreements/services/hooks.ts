import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useExtensionDetails } from "@features/extension";
import { RqlQuery } from "@swo/rql-client";
import {
  Agreement,
  AgreementListResponse,
  Order,
  OrderListResponse,
  Subscription,
  SubscriptionListResponse,
} from "@swo/mp-api-model";
import { backendClient } from "@/ui/lib/alga";
import { SWOListOptions } from "@/ui/features/shared";

export type AgreementsClientAgreementsOptions = SWOListOptions<Agreement>;

export type AgreementsClientOrdersOptions = SWOListOptions<Order>;

export type AgreementsClientSubscriptionsOptions = SWOListOptions<Subscription>;

export const useAgreements = (
  options?: AgreementsClientAgreementsOptions,
  agreementIds?: string[]
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["agreements", options, agreementIds],
    queryFn: async () => {
      const { offset = 0, limit = 10, sort } = options || {};

      const query = new RqlQuery<Agreement>();

      query
        .expand(
          "id",
          "name",
          "product.id",
          "product.name",
          "product.icon",
          "licensee.id",
          "licensee.name",
          "price.SPxM",
          "price.SPxY",
          "price.currency",
          "audit"
        )
        .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
        .paging(offset, limit);

      if (agreementIds)
        query.filter({
          field: "agreement.id",
          value: agreementIds,
          operator: "in",
        });

      const { data } = await backendClient.get<AgreementListResponse>(
        `/swo/commerce/agreements?${query.toString()}`
      );
      return data;
    },
    enabled: isConfigured && (!agreementIds || agreementIds.length > 0),
    placeholderData: keepPreviousData,
  });

  const agreements = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { agreements, pagination, ...state };
};

export const useAgreement = (id: string) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data: agreement, ...state } = useQuery({
    queryKey: ["agreements", id],
    queryFn: async () => {
      const query = new RqlQuery<Agreement>();

      query
        .expand(
          "id",
          "name",
          "product.id",
          "product.name",
          "product.icon",
          "licensee.id",
          "licensee.name",
          "price.SPxM",
          "price.SPxY",
          "price.currency",
          "audit",
          "seller.id",
          "seller.name",
          "seller.address"
        )
        .exclude("subscriptions", "lines");

      const { data } = await backendClient.get<Agreement>(
        `/swo/commerce/agreements/${id}?${query.toString()}`
      );
      return data;
    },
    enabled: isConfigured && !!id,
  });

  return { agreement, ...state };
};

export const useAgreementSubscriptions = (
  agreementId: string,
  options?: AgreementsClientSubscriptionsOptions
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["agreements", agreementId, "subscriptions", options],
    queryFn: async () => {
      const { offset = 0, limit = 10, sort } = options || {};

      const query = new RqlQuery<Subscription>();

      query
        .expand(
          "id",
          "name",
          "price.SPxM",
          "price.SPxY",
          "price.currency",
          "terms.period",
          "terms.commitment",
          "status",
          "audit"
        )
        .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
        .paging(offset, limit);

      const { data } = await backendClient.get<SubscriptionListResponse>(
        `/swo/commerce/subscriptions?agreement.id=${agreementId}&${query.toString()}`
      );

      return data;
    },
    enabled: isConfigured && !!agreementId,
    placeholderData: keepPreviousData,
  });

  const subscriptions = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { subscriptions, pagination, ...state };
};

export const useAgreementOrders = (
  agreementId: string,
  options?: AgreementsClientOrdersOptions
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["agreements", agreementId, "orders", options],
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
          "audit"
        )
        .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
        .paging(offset, limit);

      const { data } = await backendClient.get<OrderListResponse>(
        `/swo/commerce/orders?agreement.id=${agreementId}&${query.toString()}`
      );
      return data;
    },
    enabled: isConfigured && !!agreementId,
    placeholderData: keepPreviousData,
  });

  const orders = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { orders, pagination, ...state };
};
