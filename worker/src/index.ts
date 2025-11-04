import { BillingConfigClient, type BillingConfig } from "./alga/billing-config";
import {
  InvoicesClient as AlgaInvoicesClient,
  type CreateInvoiceData,
  type ManualInvoiceLine,
} from "./alga/invoices";
import { KVStorage } from "./alga/kv-storage";
import { CredentialsClient } from "./swo/credentials";
import mssql from "mssql";
import dotenv from "dotenv";
import { MigrationsClient } from "./swo/migrations";
import type { Charge, Statement } from "@swo/mp-api-model/billing";
import { StatementsClient } from "./swo/statements";

dotenv.config();

const toInvoiceData = async (
  statement: Statement,
  charges: Charge[],
  billingConfig: BillingConfig
): Promise<CreateInvoiceData | null> => {
  const agreementId = statement.agreement!.id!;

  if (!billingConfig) {
    console.warn(`Billing config not found for agreement ${agreementId}`);
    return null;
  }

  const clientId = billingConfig.consumer?.id;
  if (!clientId) {
    console.warn(`Consumer not configured for agreement ${agreementId}`);
    return null;
  }

  const serviceId = billingConfig.service?.id;
  if (!serviceId) {
    console.warn(`Service not configured for agreement ${agreementId}`);
    return null;
  }

  const lines = charges
    .map((charge) => {
      if (!charge.item?.name || !charge.price?.unitSP) {
        return null;
      }

      const description = `${charge.item.name} (${charge.id})`;

      const rate = Math.round(
        charge.price.unitSP * (1 + billingConfig.markup / 100) * 100
      );

      return {
        service_id: serviceId,
        quantity: charge.quantity ?? 0,
        description,
        rate,
      } satisfies ManualInvoiceLine;
    })
    .filter((charge) => !!charge);

  if (lines.length === 0) {
    console.warn(`No lines in SWO statement ${statement.id}`);
    return null;
  }

  return {
    clientId,
    lines,
    externalInvoiceId: statement.id!,
  } satisfies CreateInvoiceData;
};

(async () => {
  const pool = new mssql.ConnectionPool({
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    server: process.env.DB_SERVER!,
    database: process.env.DB_NAME!,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  });

  await pool.connect();

  const credentialsClient = new CredentialsClient(pool);
  const credentials = await credentialsClient.getAll();

  const migrationsClient = new MigrationsClient(pool);

  for (const { agreementId, algaAPIKey, swoAPIToken } of credentials) {
    console.log(`Migrating agreement ${agreementId}`);

    const kvStorage = new KVStorage(
      process.env.ALGA_API_URL!,
      "billing-configs",
      algaAPIKey
    );

    const billingConfigClient = new BillingConfigClient(kvStorage);
    const algaInvoicesClient = new AlgaInvoicesClient(
      process.env.ALGA_API_URL!,
      algaAPIKey
    );

    const swoStatementsClient = new StatementsClient(
      process.env.MP_API_URL!,
      swoAPIToken
    );

    for await (const statement of swoStatementsClient.getStatements({
      agreementId,
      from: new Date("2025-10-01"),
      to: new Date("2025-10-31"),
    })) {
      const statementId = statement.id!;

      console.log(`Migrating statement ${statementId}`);

      const migration = await migrationsClient.getByStatementId(statementId);
      if (migration) {
        console.log(`Statement ${statementId} already migrated`);
        continue;
      }

      const billingConfig = await billingConfigClient.getByAgreementId(
        agreementId
      );

      if (!billingConfig) {
        console.error(`Billing config not found for agreement ${agreementId}`);
        continue;
      }

      const charges = await swoStatementsClient.getAllCharges(statementId);

      const invoiceData = await toInvoiceData(
        statement,
        charges,
        billingConfig
      );

      console.log(charges, invoiceData);

      // if (!invoiceData) {
      //   console.warn(`No invoice data for statement ${statement.id}`);
      //   continue;
      // }

      // await algaInvoicesClient.create(invoiceData);

      // await migrationsClient.create({
      //   swoStatementId: statementId,
      //   algaInvoiceId: "dupa",
      //   date: new Date(),
      // });

      // console.log(`Statement ${statementId} migrated`);
    }
  }

  console.log("Done");

  await pool.close();
})();
