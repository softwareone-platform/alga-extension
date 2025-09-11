import { KVStorage } from "@lib/alga";
import { Agreement } from "./models";

const AGREEMENTS_STORAGE_KEY = "agreements";

export type AgreementChanges = Omit<Agreement, "updatedAt" | "price"> & {
  price: Omit<Agreement["price"], "RPxY">;
};

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
    const RPxY = changes.price.SPxY * (1 + changes.price.markup / 100);

    const agreement = {
      ...changes,
      updatedAt: new Date().toISOString(),
      price: {
        ...changes.price,
        RPxY,
      },
    };
    await this.kvStorage.set(
      `${AGREEMENTS_STORAGE_KEY}:${agreement.id}`,
      agreement
    );

    return agreement;
  }
}
