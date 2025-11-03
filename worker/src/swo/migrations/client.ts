import sql from "mssql";

import type { Migration } from "./models";

export class MigrationsClient {
  constructor(private pool: sql.ConnectionPool) {}

  async getByStatementId(statementId: string): Promise<Migration | null> {
    const result = await this.pool
      .request()
      .input("SWOStatementId", sql.VarChar, statementId)
      .query<{ swoStatementId: string; algaInvoiceId: string; date: string }>(
        `SELECT SWOStatementId as swoStatementId, AlgaInvoiceId as algaInvoiceId, Date as date FROM dbo.Migration WHERE SWOStatementId = @SWOStatementId`
      );

    const record = result.recordset[0];
    if (!record) return null;

    return {
      ...record,
      date: new Date(record.date),
    };
  }

  async create(migration: Migration): Promise<void> {
    await this.pool
      .request()
      .input("SWOStatementId", sql.VarChar, migration.swoStatementId)
      .input("AlgaInvoiceId", sql.VarChar, migration.algaInvoiceId)
      .input("Date", sql.DateTime2, migration.date)
      .query(
        `INSERT INTO dbo.Migration (SWOStatementId, AlgaInvoiceId, Date) VALUES (@SWOStatementId, @AlgaInvoiceId, @Date)`
      );
  }
}
