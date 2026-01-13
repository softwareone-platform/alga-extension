import { ManualInvoiceLine } from "../lib/alga";
import { BillingConfig } from "@/shared/billing-configs";
import { Charge, Statement as SWOStatement } from "@swo/mp-api-model/billing";

export const toLineItems = (
  statement: SWOStatement,
  charges: Charge[],
  billingConfig: BillingConfig
): ManualInvoiceLine[] => {
  if (!billingConfig) {
    console.warn(`Billing config not found for statement ${statement.id}`);
    return [];
  }

  if (!billingConfig.serviceId) {
    console.warn(
      `Service not configured for agreement ${billingConfig.agreementId}`
    );
    return [];
  }

  return charges
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
        serviceId: billingConfig.serviceId,
        quantity: charge.quantity ?? 0,
        description,
        rate,
      } satisfies ManualInvoiceLine;
    })
    .filter((charge) => !!charge);
};

export const invoicing = {};
