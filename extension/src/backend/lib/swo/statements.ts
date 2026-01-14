import { Charge } from "@swo/mp-api-model/billing";
// import { RqlQuery } from "@swo/rql-client";
import { fetch as httpFetch } from "alga:extension/http";
import { decode } from "../alga";
import { ChargeListResponse } from "@swo/mp-api-model/billing";

const CHARGES_LIMIT = 100;

export class StatementsClient {
  private apiUrl: string;
  private token: string;

  constructor(apiUrl: string, token: string) {
    this.apiUrl = apiUrl;
    this.token = token;
  }

  getCharges(statementId: string): Charge[] {
    let offset = 0;
    const charges: Charge[] = [];

    while (true) {
      const url = `${this.apiUrl}/billing/statements/${statementId}/charges?select=id,subscription.id,subscription.name,item.id,item.name,period.start,period.end,quantity,price.SPx1,price.unitSP&offset=${offset}&limit=${CHARGES_LIMIT}`;

      const response = httpFetch({
        method: "GET",
        url,
        headers: [
          { name: "Authorization", value: `Bearer ${this.token}` },
          { name: "Content-Type", value: "application/json" },
        ],
      });

      const responseBody = decode<ChargeListResponse>(response.body);
      if (!responseBody) {
        throw new Error(`Failed to get charges for statement ${statementId}`);
      }
      charges.push(...(responseBody.data || []));

      offset += CHARGES_LIMIT;

      const total = responseBody.$meta?.pagination?.total || 0;
      if (total <= offset) {
        break;
      }
    }

    return charges;
  }
}
