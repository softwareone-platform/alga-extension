import sql from "mssql";

import type { Credentials } from "./models";

export class CredentialsClient {
  constructor(private pool: sql.ConnectionPool) {}

  async getAll(): Promise<Credentials[]> {
    const result = await this.pool
      .request()
      .query<Credentials>(
        `SELECT AgreementId as agreementId, AlgaAPIKey as algaAPIKey, SWOAPIToken as swoAPIToken FROM dbo.Credentials`
      );

    return result.recordset;
  }
}
