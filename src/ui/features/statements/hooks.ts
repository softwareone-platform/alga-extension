import {
  useQuery,
  useMutation,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { useExtensionDetails } from "@features/extension";
import { RqlQuery } from "@swo/rql-client";
import {
  Charge,
  ChargeListResponse,
  ListMetadata,
  StatementAttachment,
  StatementAttachmentListResponse,
} from "@swo/mp-api-model/billing";
import { backendClient } from "@/ui/lib/alga";
import { SWOListOptions } from "@/ui/features/shared";
import { Statement } from "./types";
import { PaginationMetadata } from "@swo/mp-api-model/billing";
import { optionsToUrl } from "@/shared/lists";

const EMPTY_STATEMENTS: Statement[] = [];
const EMPTY_CHARGES: Charge[] = [];
const EMPTY_ATTACHMENTS: StatementAttachment[] = [];
const EMPTY_PAGINATION: PaginationMetadata = {};

export type StatementListResponse = {
  data: Statement[];
  $meta: ListMetadata;
};

export type StatementsClientStatementsOptions = SWOListOptions<Statement>;

export type StatementsClientChargesOptions = SWOListOptions<Charge>;

export type StatementsClientAttachmentsOptions =
  SWOListOptions<StatementAttachment>;

export const useStatements = (
  options: StatementsClientStatementsOptions = { offset: 0, limit: 100 },
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["statements", options],
    queryFn: async () => {
      const { data } = await backendClient.get<StatementListResponse>(
        `/statements?${optionsToUrl(options)}`,
      );
      return data;
    },
    enabled: isConfigured,
    placeholderData: keepPreviousData,
  });

  const statements = data?.data || EMPTY_STATEMENTS;
  const pagination = data?.$meta?.pagination || EMPTY_PAGINATION;

  return { statements, pagination, ...state };
};

export const useStatement = (id: string) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data: statement, ...state } = useQuery({
    queryKey: ["statements", id],
    queryFn: async () => {
      const { data } = await backendClient.get<Statement>(`/statements/${id}`);

      return data;
    },
    enabled: isConfigured && !!id,
  });

  return { statement, ...state };
};

export const useStatementCharges = (
  statementId: string,
  options?: StatementsClientChargesOptions,
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
          "audit",
          "subscription.id",
          "subscription.name",
          "item.id",
          "item.name",
          "period.start",
          "period.end",
          "quantity",
          "price.SPx1",
          "price.unitSP",
        )
        .paging(offset, limit);

      if (sort) query.orderBy([sort.by, sort.order || "asc"]);

      const { data } = await backendClient.get<ChargeListResponse>(
        `/swo/billing/statements/${statementId}/charges?${query.toString()}`,
      );

      return data;
    },
    enabled: isConfigured && !!statementId,
    placeholderData: keepPreviousData,
  });

  const charges = data?.data || EMPTY_CHARGES;
  const pagination = data?.$meta?.pagination || EMPTY_PAGINATION;

  return { charges, pagination, ...state };
};

export const useStatementAttachments = (
  statementId: string,
  options?: StatementsClientAttachmentsOptions,
) => {
  const { details } = useExtensionDetails();
  const isConfigured = !!details?.hasToken && !!details?.endpoint;

  const { data, ...state } = useQuery({
    queryKey: ["statements", statementId, "attachments", options],
    queryFn: async () => {
      const { offset = 0, limit = 10 } = options || {};

      const query = new RqlQuery<StatementAttachment>();
      query.expand(
        "id",
        "audit",
        "name",
        "description",
        "filename",
        "size",
        "isDeleted",
      );
      query.filter({
        field: "isDeleted",
        value: false,
        operator: "eq",
      });
      query.paging(offset, limit);

      const { data } = await backendClient.get<StatementAttachmentListResponse>(
        `/swo/billing/statements/${statementId}/attachments?${query.toString()}`,
      );

      return data;
    },
    enabled: isConfigured && !!statementId,
    placeholderData: keepPreviousData,
  });

  const attachments = data?.data || EMPTY_ATTACHMENTS;
  const pagination = data?.$meta?.pagination || EMPTY_PAGINATION;

  return { attachments, pagination, ...state };
};

export const useStatementActions = (statementId: string) => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, status } = useMutation({
    mutationFn: () =>
      backendClient.post<Statement>(
        `/statements/${statementId}/create-invoice`,
      ),
    onSuccess: (response) =>
      queryClient.setQueryData(["statements", statementId], response.data),
  });

  return {
    createInvoice: mutate,
    createInvoiceAsync: mutateAsync,
    createInvoiceStatus: status,
  };
};
