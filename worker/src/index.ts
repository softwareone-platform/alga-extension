import { BillingConfigClient, type BillingConfig } from "./alga/billing-config";
import {
  InvoicesClient as AlgaInvoicesClient,
  type CreateInvoiceData,
  type ManualInvoiceLine,
} from "./alga/invoices";
import { KVStorage } from "./alga/kv-storage";
import mssql from "mssql";
import dotenv from "dotenv";
import { MigrationsClient } from "./alga/migrations";
import type { Charge, Statement } from "@swo/mp-api-model/billing";
import { StatementsClient } from "./swo/statements";
import { ExtensionClient } from "./alga/extension";

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
      if (!charge.price?.unitSP) {
        console.warn(`No price for charge ${charge.id}`);
        return null;
      }

      const description = `${
        charge.item?.name || charge.description?.value1
      } (${charge.id})`;

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

  for (const bc of await billingConfigClient.getAll()) {
    if (bc.status !== "active") {
      console.log(`Billing config ${bc.id} is not active. Skipping...`);
      continue;
    }

    const agreementId = bc.agreementId;

    const migration = await migrationsClient.getByAgreementId(agreementId);
    if (migration) {
      console.log(`Agreement ${agreementId} already migrated`);
      continue;
    }

    console.log(`Migrating agreement ${agreementId}`);

    for await (const statement of swoStatementsClient.getStatements({
      agreementId,
      from: new Date("2025-10-01"),
      to: new Date("2025-10-31"),
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

      await migrationsClient.create(agreementId);

      console.log(`Statement ${statementId} migrated`);
    }
  }

  console.log("Done");

  await pool.close();
})();
