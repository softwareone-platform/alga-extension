import { Charge } from "@swo/mp-api-model/billing";
import { RqlQuery } from "@swo/rql-client";
import { extension } from "../../features/extension";
import { fetch as httpFetch } from "alga:extension/http";
import { decode } from "../alga";
import { ChargeListResponse } from "@swo/mp-api-model/billing";

const CHARGES_LIMIT = 100;

export const statements = {
  getCharges: (statementId: string): Charge[] => {
    let offset = 0;
    const { token, endpoint, status } = extension.getDetails();

    if (status !== "active") {
      throw new Error("Extension is not active");
    }

    const charges: Charge[] = [];

    while (true) {
      const query = new RqlQuery<Charge>();
      query
        .expand(
          "id",
          "subscription.id",
          "subscription.name",
          "item.id",
          "item.name",
          "period.start",
          "period.end",
          "quantity",
          "price.SPx1",
          "price.unitSP"
        )
        .paging(offset, CHARGES_LIMIT);

      const response = httpFetch({
        method: "GET",
        url: `${endpoint}/billing/statements/${statementId}/charges?${query.toString()}`,
        headers: [
          { name: "Authorization", value: `Bearer ${token}` },
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
  },
};
