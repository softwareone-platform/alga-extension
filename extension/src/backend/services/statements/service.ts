import { InvoicesClient, StorageClient } from "@/backend/lib/alga";
import { StatementsClient } from "@/backend/lib/swo";

export class StatementsService {
  private readonly storage: StorageClient;
  private readonly statementsClient: StatementsClient;
  private readonly invoicesClient: InvoicesClient;

  constructor(
    storage: StorageClient,
    statementsClient: StatementsClient,
    invoicesClient: InvoicesClient
  ) {
    this.storage = storage;
    this.statementsClient = statementsClient;
    this.invoicesClient = invoicesClient;
  }
}
