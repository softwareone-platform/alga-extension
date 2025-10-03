import { RqlQuery } from "@swo/rql-client";
import { AxiosInstance, AxiosResponse } from "axios";
import {
  Statement,
  StatementListResponse,
  ChargeListResponse,
  Charge,
} from "@swo/mp-api-model/billing";
import { axiosInstance, ListOptions } from "./shared";

export type StatementsClientStatementsOptions = ListOptions<Statement> & {
  licenseeId?: string;
};

export type StatementsClientChargesOptions = ListOptions<Charge>;

export class StatementsClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axios = axiosInstance(baseUrl, token);
  }

  async getStatements(
    options?: StatementsClientStatementsOptions
  ): Promise<StatementListResponse> {
    const { offset = 0, limit = 10, sort, licenseeId } = options || {};

    const query = new RqlQuery<Statement>();

    query
      .expand(
        "id",
        "type",
        "agreement.id",
        "agreement.name",
        "product.id",
        "product.name",
        "product.icon",
        "licensee.id",
        "licensee.name",
        "price.currency",
        "price.totalSP",
        "status",
        "audit"
      )
      .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
      .paging(offset, limit);

    if (sort) query.orderBy([sort.by, sort.order || "asc"]);

    if (licenseeId)
      query.filter({
        field: "licensee.id",
        value: licenseeId,
        operator: "eq",
      });

    const { data }: AxiosResponse<StatementListResponse> = await this.axios.get(
      `/billing/statements?${query.toString()}`
    );

    return data;
  }

  async getStatement(id: string): Promise<Statement> {
    const query = new RqlQuery<Statement>();

    query.expand(
      "id",
      "type",
      "agreement.id",
      "agreement.name",
      "product.id",
      "product.name",
      "product.icon",
      "licensee.id",
      "licensee.name",
      "price.currency",
      "price.totalSP",
      "invoice" as any,
      "status",
      "audit"
    );

    const { data }: AxiosResponse<Statement> = await this.axios.get(
      `/billing/statements/${id}?${query.toString()}`
    );

    return data;
  }

  async getCharges(
    statementId: string,
    options?: ListOptions<Charge>
  ): Promise<ChargeListResponse> {
    const { offset = 0, limit = 10, sort } = options || {};

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
      .paging(offset, limit);

    if (sort) query.orderBy([sort.by, sort.order || "asc"]);

    const { data }: AxiosResponse<ChargeListResponse> = await this.axios.get(
      `/billing/statements/${statementId}/charges?${query.toString()}`
    );

    return data;
  }
}
