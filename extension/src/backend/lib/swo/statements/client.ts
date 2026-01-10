import { RqlQuery } from "@swo/rql-client";
import type {
  Statement,
  ChargeListResponse,
  Charge,
  StatementListResponse,
} from "@swo/mp-api-model/billing";
import { fetch as httpFetch } from "alga:extension/http";
import { decode } from "../../alga/utils";
import dayjs from "dayjs";

export type GetStatementsOptions = {
  agreementId: string;
  date: Date | string;
};

export class StatementsClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  getStatements({ agreementId, date }: GetStatementsOptions): Statement[] {
    const statements: Statement[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const query = new RqlQuery<Statement>()
        .expand("id", "type", "agreement.id", "agreement.name")
        .filter({
          value: [
            {
              field: "agreement.id",
              value: agreementId,
              operator: "eq",
            },
            {
              field: "audit.created.at",
              value: dayjs(date)
                .startOf("day")
                .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
              operator: "ge",
            },
            {
              field: "audit.created.at",
              value: dayjs(date)
                .endOf("day")
                .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
              operator: "le",
            },
          ],
          operator: "and",
        })
        .paging(offset, limit);

      const response = httpFetch({
        method: "GET",
        url: `${this.baseUrl}/v1/billing/statements?${query.toString()}`,
        headers: [
          { name: "Content-Type", value: "application/json" },
          { name: "Authorization", value: `Bearer ${this.token}` },
        ],
      });

      const responseBody = decode<StatementListResponse>(response.body);
      const items = responseBody?.data || [];
      const total = responseBody?.$meta?.pagination?.total || 0;

      statements.push(...items);

      if (total <= offset + limit) break;

      offset += limit;
    }

    return statements;
  }

  getCharges(statementId: string): Charge[] {
    const charges: Charge[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const query = new RqlQuery<Charge>()
        .expand(
          "id",
          "subscription.id",
          "subscription.name",
          "item.id",
          "item.name",
          "description",
          "quantity",
          "price.unitSP"
        )
        .paging(offset, limit);

      const response = httpFetch({
        method: "GET",
        url: `${
          this.baseUrl
        }/v1/billing/statements/${statementId}/charges?${query.toString()}`,
        headers: [
          { name: "Content-Type", value: "application/json" },
          { name: "Authorization", value: `Bearer ${this.token}` },
        ],
      });

      const responseBody = decode<ChargeListResponse>(response.body);
      const items = responseBody?.data || [];
      const total = responseBody?.$meta?.pagination?.total || 0;

      charges.push(...items);

      if (total <= offset + limit) break;

      offset += limit;
    }

    return charges;
  }
}
