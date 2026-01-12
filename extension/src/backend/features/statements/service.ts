import { StorageClient } from "@/backend/lib/alga";
import { AlgaStatementDetails, Statement } from "@/shared/statements";
import { Statement as SWOStatement } from "@swo/mp-api-model/billing";
import { BillingConfigsService } from "../billing-configs";
import { BillingConfig } from "../billing-configs";

const STORAGE_KEY = "statements";

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

export class StatementsService {
  private readonly storage: StorageClient;
  private readonly billingConfigsService: BillingConfigsService;

  constructor(
    storage: StorageClient,
    billingConfigsService: BillingConfigsService
  ) {
    this.storage = storage;
    this.billingConfigsService = billingConfigsService;
  }

  getStatements(swoStatements: SWOStatement[]): Statement[] {
    const details =
      this.storage.get<{ all: AlgaStatementDetails[] }>(STORAGE_KEY)?.all ?? [];

    const detailsByStatementId = details.reduce((acc, detail) => {
      acc[detail.statementId] = detail;
      return acc;
    }, {} as Record<string, AlgaStatementDetails>);

    const billingConfigs = this.billingConfigsService.getConfigs();

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
  }
}
