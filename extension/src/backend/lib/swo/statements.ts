import { Charge } from "@swo/mp-api-model/billing";
import { ChargeListResponse } from "@swo/mp-api-model/billing";
import { SWOClient } from "./client";

const CHARGES_LIMIT = 100;

export class StatementsClient {
  private swoClient: SWOClient;

  constructor(swoClient: SWOClient) {
    this.swoClient = swoClient;
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
