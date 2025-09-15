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

  async getAgreements(ids: string[]): Promise<Agreement[]> {
    // TODO: Temp
    return await Promise.all(ids.map((id) => this.getAgreement(id))).then(
      (agreements) => agreements.filter((agreement) => !!agreement)
    );
  }

  async saveAgreement(changes: AgreementChanges): Promise<Agreement> {
    const agreement = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await this.kvStorage.set(
      `${AGREEMENTS_STORAGE_KEY}:${agreement.id}`,
      agreement
    );

    return agreement;
  }
}
