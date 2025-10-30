import { BillingConfigClient } from "./alga/billing-config";
import { InvoicesClient as AlgaInvoicesClient } from "./alga/invoices";
import { KVStorage } from "./alga/kv-storage";
import {
  InvoicesClient as SWOInvoicesClient,
  type Invoice as SWOInvoice,
} from "./swo/invoices";
import { CredentialsClient } from "./swo/credentials";
import mssql from "mssql";
import dotenv from "dotenv";
import { MigrationsClient } from "./swo/migrations";

dotenv.config();

const migrateInvoice = async (
  invoice: SWOInvoice,
  billingConfigClient: BillingConfigClient,
  invoicesClient: AlgaInvoicesClient
): Promise<void> => {
  const billingConfig = await billingConfigClient.getByAgreementId(
    invoice.agreement.id
  );

  if (!billingConfig) {
    console.warn(
      `Billing config not found for agreement ${invoice.agreement.id}`
    );
    return;
  }

  const clientId = billingConfig.consumer?.id;
  if (!clientId) {
    console.warn(
      `Consumer not configured for agreement ${invoice.agreement.id}`
    );
    return;
  }

  const serviceId = billingConfig.service?.id;
  if (!serviceId) {
    console.warn(
      `Service not configured for agreement ${invoice.agreement.id}`
    );
    return;
  }

  const lines = invoice.lines
    .map((line) => {
      const description = `${line.description} (${line.id})`;

      const rate = Math.round(
        line.price.unitPrice * (1 + billingConfig.markup / 100) * 100
      );

      return {
        service_id: serviceId,
        quantity: line.price.quantity,
        description,
        rate,
      };
    })
    .filter((line) => line.quantity > 0);

  if (lines.length === 0) {
    console.warn(`No lines in SWO invoice ${invoice.id}`);
    return;
  }

  await invoicesClient.create({
    clientId,
    lines,
    externalInvoiceId: invoice.id,
  });
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

    const swoInvoicesClient = new SWOInvoicesClient(
      process.env.MP_API_URL!,
      swoAPIToken
    );

    for await (const invoice of swoInvoicesClient.getMany({
      agreementId,
      before: new Date("2025-08-31"),
      after: new Date("2025-10-01"),
    })) {
      console.log(`Migrating invoice ${invoice.id}`);

      const migration = await migrationsClient.getByInvoiceId(invoice.id);
      if (migration) {
        console.log(`Invoice ${invoice.id} already migrated`);
        continue;
      }

      //temp
      invoice.agreement.id = "AGR-0032-5644-8083";

      await migrateInvoice(invoice, billingConfigClient, algaInvoicesClient);

      await migrationsClient.create({
        swoInvoiceId: invoice.id,
        algaInvoiceId: "dupa",
        date: new Date(),
      });

      console.log(`Invoice ${invoice.id} migrated`);
    }
  }

  await pool.close();
})();
