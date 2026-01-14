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
      const url = `/billing/statements/${statementId}/charges?select=id,subscription.id,subscription.name,item.id,item.name,period.start,period.end,quantity,price.SPx1,price.unitSP&offset=${offset}&limit=${CHARGES_LIMIT}`;

      const [response, status] = this.swoClient.fetch<ChargeListResponse>(url);
      if (status !== 200) {
        throw new Error(
          `Failed to fetch charges. SWO API returned ${status} (${response})`
        );
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
