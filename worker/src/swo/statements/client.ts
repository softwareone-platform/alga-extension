import { RqlQuery } from "@swo/rql-client";
import type {
  Statement,
  ChargeListResponse,
  Charge,
  StatementListResponse,
} from "@swo/mp-api-model/billing";
import { type AxiosInstance, type AxiosResponse } from "axios";
import { axiosInstance } from "../shared";

export type GetStatementsOptions = {
  agreementId: string;
  from: Date;
  to: Date;
};

export class StatementsClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axios = axiosInstance(baseUrl, token);
  }

  async *getStatements({
    agreementId,
    from,
    to,
  }: GetStatementsOptions): AsyncGenerator<Statement> {
    let offset = 0;
    let limit = 100;

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
            ,
            {
              field: "audit.created.at",
              value: from.toISOString(),
              operator: "ge",
            },
            {
              field: "audit.created.at",
              value: to.toISOString(),
              operator: "le",
            },
          ],
          operator: "and",
        })
        .paging(offset, limit);

      const response: AxiosResponse<StatementListResponse> =
        await this.axios.get(`v1/billing/statements?${query.toString()}`);

      const items = response.data.data || [];
      const total = response.data.$meta?.pagination?.total || 0;

      console.log(`Found ${items.length} statements`);

      yield* items;

      if (total <= offset + limit) break;

      offset += limit;
    }
  }

  async *getCharges(statementId: string): AsyncGenerator<Charge> {
    let offset = 0;
    let limit = 100;

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

      const { data }: AxiosResponse<ChargeListResponse> = await this.axios.get(
        `/billing/statements/${statementId}/charges?${query.toString()}`
      );

      const items = data.data || [];
      const total = data.$meta?.pagination?.total || 0;

      yield* items;

      if (total <= offset + limit) break;

      offset += limit;
    }
  }

  async getAllCharges(statementId: string): Promise<Charge[]> {
    const charges = [];

    for await (const charge of this.getCharges(statementId)) {
      charges.push(charge);
    }

    return charges;
  }
}
