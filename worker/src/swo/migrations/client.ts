import sql from "mssql";

import type { Migration } from "./models";

export class MigrationsClient {
  constructor(private pool: sql.ConnectionPool) {}

  async getByInvoiceId(invoiceId: string): Promise<Migration | null> {
    const result = await this.pool
      .request()
      .input("SWOInvoiceId", sql.VarChar, invoiceId)
      .query<{ swoInvoiceId: string; algaInvoiceId: string; date: string }>(
        `SELECT SWOInvoiceId as swoInvoiceId, AlgaInvoiceId as algaInvoiceId, Date as date FROM dbo.Migration WHERE SWOInvoiceId = @SWOInvoiceId`
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
      .input("SWOInvoiceId", sql.VarChar, migration.swoInvoiceId)
      .input("AlgaInvoiceId", sql.VarChar, migration.algaInvoiceId)
      .input("Date", sql.DateTime2, migration.date)
      .query(
        `INSERT INTO dbo.Migration (SWOInvoiceId, AlgaInvoiceId, Date) VALUES (@SWOInvoiceId, @AlgaInvoiceId, @Date)`
      );
  }
}
