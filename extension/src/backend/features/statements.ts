import { storage } from "../lib/alga/storage";
import { AlgaStatementDetails, Statement } from "@/shared/statements";
import { Statement as SWOStatement } from "@swo/mp-api-model/billing";
import { BillingConfig } from "@/shared/billing-configs";
import { billingConfigs } from "./billing-configs";

const STORAGE_NAMESPACE = "swo.statements";
const STORAGE_KEY = "all";

export type GetStatementsOptions = {
  agreementId?: string;
  paging?: {
    offset?: number;
    limit?: number;
  };
};

const defaultDetails = (
  swoStatement: SWOStatement,
  billingConfig?: BillingConfig
): AlgaStatementDetails => ({
  statementId: swoStatement.id!,
  status: billingConfig ? "to-invoice" : "no-invoice",
  audit: { createdAt: new Date().toISOString() },
});

const toStatements = (
  swoStatements: SWOStatement[],
  algaDetails: AlgaStatementDetails[],
  billingConfigs: BillingConfig[]
): Statement[] => {
  const detailsByStatementId = algaDetails.reduce((acc, detail) => {
    acc[detail.statementId] = detail;
    return acc;
  }, {} as Record<string, AlgaStatementDetails>);

  const billingConfigsByAgreementId = billingConfigs.reduce((acc, config) => {
    acc[config.agreementId] = config;
    return acc;
  }, {} as Record<string, BillingConfig>);

  const statements = swoStatements.map((swoStatement) => {
    const statementId = swoStatement.id;
    const agreementId = swoStatement.agreement?.id;
    if (!statementId || !agreementId) {
      return null;
    }

    const billingConfig = billingConfigsByAgreementId[agreementId];
    const details =
      detailsByStatementId[statementId] ||
      defaultDetails(swoStatement, billingConfig);

    return {
      id: statementId,
      swoStatement,
      algaStatementDetails: details,
      billingConfig,
    };
  });

  return statements.filter((statement) => statement !== null);
};

export const statements = {
  getStatements: (swoStatements: SWOStatement[]): Statement[] => {
    const details =
      storage.get<{ all: AlgaStatementDetails[] }>(
        STORAGE_NAMESPACE,
        STORAGE_KEY
      )?.all ?? [];

    const bcs = billingConfigs.getConfigs();

    return toStatements(swoStatements, details, bcs);
  },
};
