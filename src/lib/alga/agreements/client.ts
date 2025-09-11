import { KVStorage } from "@lib/alga";
import { Agreement, DEFAULT_AGREEMENT } from "./models";

const AGREEMENTS_STORAGE_KEY = "agreements";

export class ExtensionClient {
  private kvStorage: KVStorage;

  constructor(kvStorage: KVStorage) {
    this.kvStorage = kvStorage;
  }

  async getAgreement(id: string): Promise<Agreement> {
    const stored = await this.kvStorage.get<Agreement>(
      `${AGREEMENTS_STORAGE_KEY}:${id}`
    );

    return stored || DEFAULT_AGREEMENT;
  }

  async saveAgreement(newAgreement: Agreement) {
    const oldDetails = await this.getAgreement();

    const details = {
      ...oldDetails,
      ...newDetails,
      status: isComplete ? "active" : "unconfigured",
      createdAt: oldDetails.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activatedAt: isComplete ? new Date().toISOString() : "",
    };

    await this.kvStorage.set(SETTINGS_STORAGE_KEY, details);

    return details;
  }
}
