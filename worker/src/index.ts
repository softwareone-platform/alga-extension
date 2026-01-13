import { BillingConfigClient } from "./alga/billing-config";
import { InvoicesClient as AlgaInvoicesClient } from "./alga/invoices";
import { KVStorage } from "./alga/kv-storage";
import dotenv from "dotenv";
import { MigrationsClient } from "./alga/migrations";
import { StatementsClient } from "./swo/statements";
import { ExtensionClient } from "./alga/extension";
import dayjs from "dayjs";

dotenv.config();

(async () => {
  const algaInvoicesClient = new AlgaInvoicesClient(
    process.env.ALGA_API_URL!,
    process.env.ALGA_API_KEY!
  );

  const extensionStorage = new KVStorage(
    process.env.ALGA_API_URL!,
    "extension",
    process.env.ALGA_API_KEY!
  );
  const extensionClient = new ExtensionClient(extensionStorage);

  const billingConfigsStorage = new KVStorage(
    process.env.ALGA_API_URL!,
    "billing-configs",
    process.env.ALGA_API_KEY!
  );
  const billingConfigClient = new BillingConfigClient(billingConfigsStorage);

  const migrationsStorage = new KVStorage(
    process.env.ALGA_API_URL!,
    "migrations",
    process.env.ALGA_API_KEY!
  );
  const migrationsClient = new MigrationsClient(migrationsStorage);

  // await billingConfigsStorage.clear();
  // throw new Error("test");

  const details = await extensionClient.getDetails();
  if (!details) {
    throw new Error("Extension details not found");
  }

  const swoStatementsClient = new StatementsClient(
    process.env.MP_API_URL!,
    details.token
  );

  const date = new Date("2025-10-20");

  for (const bc of await billingConfigClient.getAll()) {
    if (bc.status !== "active") {
      console.log(`Billing config ${bc.id} is not active. Skipping...`);
      continue;
    }

    const agreementId = bc.agreementId;

    const migration = await migrationsClient.getMigration(agreementId, date);
    if (migration) {
      console.log(
        `Agreement ${agreementId} on ${dayjs(date).format(
          "YYYY-MM-DD"
        )} already migrated`
      );
      continue;
    }

    console.log(`Migrating agreement ${agreementId}`);

    for await (const statement of swoStatementsClient.getStatements({
      agreementId,
      date,
    })) {
      const statementId = statement.id!;

      console.log(`Migrating statement ${statementId}`);

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

      if (!invoiceData) {
        console.warn(`No invoice data for statement ${statement.id}`);
        continue;
      }

      await algaInvoicesClient.create(invoiceData);

      await migrationsClient.create(agreementId, date);

      console.log(`Statement ${statementId} migrated`);
    }
  }

  console.log("Done");
})();
