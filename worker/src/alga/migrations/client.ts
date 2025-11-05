import { KVStorage } from "../kv-storage";
import type { Migration } from "./models";

const MIGRATIONS = "migrations";

export class MigrationsClient {
  constructor(private kvStorage: KVStorage) {}

  async getByAgreementId(agreementId: string): Promise<Migration | null> {
    const result = await this.kvStorage.get<Migration>(
      `${MIGRATIONS}-${agreementId}`
    );

    return result?.value || null;
  }

  async create(agreementId: string): Promise<void> {
    await this.kvStorage.set(`${MIGRATIONS}-${agreementId}`, {
      agreementId,
      migratedAt: new Date().toISOString(),
    });
  }
}
