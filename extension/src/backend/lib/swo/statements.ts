import { Charge, Statement } from "@swo/mp-api-model/billing";
import { ChargeListResponse } from "@swo/mp-api-model/billing";
import { SWOClient } from "./client";

const CHARGES_LIMIT = 100;

export class StatementsClient {
  private swoClient: SWOClient;

  constructor(swoClient: SWOClient) {
    this.swoClient = swoClient;
  }

  getStatementById(statementId: string): Statement {
    return this.swoClient.fetch<Statement>(
      `/billing/statements/${statementId}`,
      `select=id,type,agreement.id,agreement.name,product.id,product.name,product.icon,licensee.id,licensee.name,price.currency,price.totalSP,invoice,status,audit`
    );
  }

  getCharges(statementId: string): Charge[] {
    let offset = 0;
    const charges: Charge[] = [];

    while (true) {
      const response = this.swoClient.fetch<ChargeListResponse>(
        `/billing/statements/${statementId}/charges`,
        `select=id,subscription.id,subscription.name,item.id,item.name,period.start,period.end,quantity,price.SPx1,price.unitSP&offset=${offset}&limit=${CHARGES_LIMIT}`
      );
      if (!response) {
        throw new Error(`Failed to fetch charges.`);
      }

      const { data, $meta } = response!;
      charges.push(...(data || []));

      offset += CHARGES_LIMIT;

      const total = $meta?.pagination?.total || 0;
      if (total <= offset) {
        break;
      }
    }

    return charges;
  }
}
