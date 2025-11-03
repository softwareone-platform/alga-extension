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

    const baseQuery = new RqlQuery<Statement>()
      .expand("id", "type", "agreement.id", "agreement.name")
      .filter({
        field: "agreement.id",
        value: agreementId,
        operator: "eq",
      })
      .filter({
        field: "audit.created.at",
        value: encodeURIComponent(from.toISOString()),
        operator: "ge",
      })
      .filter({
        field: "audit.created.at",
        value: encodeURIComponent(to.toISOString()),
        operator: "le",
      });

    while (true) {
      const query = baseQuery.paging(offset, limit);

      const { data }: AxiosResponse<StatementListResponse> =
        await this.axios.get(`/billing/statements?${query.toString()}`);

      const items = data.data || [];
      const total = data.$meta?.pagination?.total || 0;

      yield* items;

      if (total <= offset + limit) break;

      offset += limit;
    }
  }

  async *getCharges(statementId: string): AsyncGenerator<Charge> {
    let offset = 0;
    let limit = 100;

    const baseQuery = new RqlQuery<Charge>().expand(
      "id",
      "subscription.id",
      "subscription.name",
      "item.id",
      "item.name",
      "description",
      "quantity",
      "price.unitSP"
    );

    while (true) {
      const query = baseQuery.paging(offset, limit);

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
