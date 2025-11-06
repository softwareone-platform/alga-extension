import dayjs from "dayjs";
import { KVStorage } from "../kv-storage";
import type { Migration } from "./models";

const MIGRATIONS = "migrations";

export class MigrationsClient {
  constructor(private kvStorage: KVStorage) {}

  async getMigration(
    agreementId: string,
    date: string | Date
  ): Promise<Migration | null> {
    const result = await this.kvStorage.get<Migration>(
      `${MIGRATIONS}-${agreementId}-${dayjs(date).format("YYYY-MM-DD")}`
    );

    return result?.value || null;
  }

  async create(agreementId: string, date: string | Date): Promise<void> {
    const migrationDate = dayjs(date).format("YYYY-MM-DD");
    await this.kvStorage.set(`${MIGRATIONS}-${agreementId}-${migrationDate}`, {
      agreementId,
      migrationDate,
    });
  }
}
