import { useContext } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { StatementsContext } from "./context";
import {
  StatementsClientStatementsOptions,
  StatementsClientChargesOptions,
} from "@lib/swo-proxy";

export const useStatements = (
  options?: StatementsClientStatementsOptions,
  agreementIds?: string[]
) => {
  const { client } = useContext(StatementsContext);

  const { data, ...state } = useQuery({
    queryKey: ["statements", options],
    queryFn: () => client!.getStatements(options, agreementIds),
    enabled: !!client && (!agreementIds || agreementIds.length > 0),
    placeholderData: keepPreviousData,
  });

  const statements = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { statements, pagination, ...state };
};

export const useStatement = (id: string) => {
  const { client } = useContext(StatementsContext);

  const { data: statement, ...state } = useQuery({
    queryKey: ["statements", id],
    queryFn: () => client!.getStatement(id),
    enabled: !!client,
  });

  return { statement, ...state };
};

export const useStatementCharges = (
  statementId: string,
  options?: StatementsClientChargesOptions
) => {
  const { client } = useContext(StatementsContext);

  const { data, ...state } = useQuery({
    queryKey: ["statements", statementId, "charges", options],
    queryFn: () => client!.getCharges(statementId, options),
    enabled: !!client,
    placeholderData: keepPreviousData,
  });

  const charges = data?.data || [];
  const pagination = data?.$meta?.pagination || { total: 0 };

  return { charges, pagination, ...state };
};
