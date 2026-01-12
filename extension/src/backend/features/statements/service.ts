import { InvoicesClient, StorageClient } from "@/backend/lib/alga";
import { Statement } from "@/shared/statements";
import { Statement as SWOStatement } from "@swo/mp-api-model/billing";

export type GetStatementsOptions = {
  agreementId?: string;
  paging?: {
    offset?: number;
    limit?: number;
  };
};

export class StatementsService {
  private readonly storage: StorageClient;
  private readonly invoicesClient: InvoicesClient;

  constructor(storage: StorageClient, invoicesClient: InvoicesClient) {
    this.storage = storage;
    this.invoicesClient = invoicesClient;
  }

  getStatements(forStatements: SWOStatement[]): Statement[] {
    this.storage.get();
  }
}
