import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useExtensionDetails } from "@features/extension";
import { RqlQuery } from "@swo/rql-client";
import {
  Statement,
  StatementListResponse,
  Charge,
  ChargeListResponse,
} from "@swo/mp-api-model/billing";
import { backendClient } from "@/ui/lib/alga";
import { SWOListOptions } from "@/ui/features/shared";

export type StatementsClientStatementsOptions = SWOListOptions<Statement> & {
  licenseeId?: string;
};

export type StatementsClientChargesOptions = SWOListOptions<Charge>;

export const useStatements = (
  options?: StatementsClientStatementsOptions,
  agreementIds?: string[]
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["statements", options, agreementIds],
    queryFn: async () => {
      const { offset = 0, limit = 10, sort, licenseeId } = options || {};

      const query = new RqlQuery<Statement>();
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
          "price.totalSP",
          "status",
          "audit"
        )
        .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
        .paging(offset, limit);

      if (sort) query.orderBy([sort.by, sort.order || "asc"]);

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

      const { data } = await backendClient.get<StatementListResponse>(
        `/statements?${query.toString()}`
      );

      return data;
    },
    enabled: isConfigured && (!agreementIds || agreementIds.length > 0),
    placeholderData: keepPreviousData,
  });

  const statements = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { statements, pagination, ...state };
};

export const useStatement = (id: string) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data: statement, ...state } = useQuery({
    queryKey: ["statements", id],
    queryFn: async () => {
      const query = new RqlQuery<Statement>();

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
        "price.totalSP",
        "invoice" as any,
        "status",
        "audit"
      );

      const { data } = await backendClient.get<Statement>(
        `/statements/${id}?${query.toString()}`
      );

      return data;
    },
    enabled: isConfigured && !!id,
  });

  return { statement, ...state };
};

export const useStatementCharges = (
  statementId: string,
  options?: StatementsClientChargesOptions
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["statements", statementId, "charges", options],
    queryFn: async () => {
      const { offset = 0, limit = 10, sort } = options || {};

      const query = new RqlQuery<Charge>();

      query
        .expand(
          "id",
          "subscription.id",
          "subscription.name",
          "item.id",
          "item.name",
          "period.start",
          "period.end",
          "quantity",
          "price.SPx1",
          "price.unitSP"
        )
        .paging(offset, limit);

      if (sort) query.orderBy([sort.by, sort.order || "asc"]);

      const { data } = await backendClient.get<ChargeListResponse>(
        `/swo/billing/statements/${statementId}/charges?${query.toString()}`
      );

      return data;
    },
    enabled: isConfigured && !!statementId,
    placeholderData: keepPreviousData,
  });

  const charges = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { charges, pagination, ...state };
};
