import { KVStorage } from "@lib/alga";
import { Agreement } from "./models";

const AGREEMENTS_STORAGE_KEY = "agreements";

export type AgreementChanges = Omit<Agreement, "updatedAt">;

export class AgreementsClient {
  private kvStorage: KVStorage;

  constructor(kvStorage: KVStorage) {
    this.kvStorage = kvStorage;
  }

  async getAgreement(id: string): Promise<Agreement | null> {
    return await this.kvStorage.get<Agreement>(
      `${AGREEMENTS_STORAGE_KEY}:${id}`
    );
  }

  async saveAgreement(changes: AgreementChanges): Promise<Agreement> {
    const agreement = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await this.kvStorage.set(AGREEMENTS_STORAGE_KEY, agreement);

    return agreement;
  }
}
