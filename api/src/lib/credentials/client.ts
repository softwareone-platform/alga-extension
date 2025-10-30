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

  async upsert(credentials: Credentials): Promise<Credentials> {
    await this.pool
      .request()
      .input("AgreementId", sql.VarChar, credentials.agreementId)
      .input("AlgaAPIKey", sql.VarChar, credentials.algaAPIKey)
      .input("SWOAPIToken", sql.VarChar, credentials.swoAPIToken)
      .query(
        `MERGE dbo.Credentials AS target
         USING (SELECT @AgreementId AS AgreementId, @AlgaAPIKey AS AlgaAPIKey, @SWOAPIToken AS SWOAPIToken) AS source
         ON target.AgreementId = source.AgreementId
         WHEN MATCHED THEN
           UPDATE SET AlgaAPIKey = source.AlgaAPIKey, SWOAPIToken = source.SWOAPIToken
         WHEN NOT MATCHED THEN
           INSERT (AgreementId, AlgaAPIKey, SWOAPIToken) VALUES (source.AgreementId, source.AlgaAPIKey, source.SWOAPIToken);`
      );

    return credentials;
  }
}
