import { RqlQuery } from "@swo/rql-client";
import {
  Statement,
  StatementListResponse,
  ChargeListResponse,
  Charge,
} from "@swo/mp-api-model/billing";
import { callProxy, type UiProxyHost } from "@lib/proxy";
import { ListOptions, ProxyClientConfig } from "./shared";

export type StatementsClientStatementsOptions = ListOptions<Statement> & {
  licenseeId?: string;
};

export type StatementsClientChargesOptions = ListOptions<Charge>;

export class StatementsClient {
  private uiProxy: UiProxyHost;

  constructor(config: ProxyClientConfig) {
    this.uiProxy = config.uiProxy;
  }

  async getStatements(
    options?: StatementsClientStatementsOptions,
    agreementIds?: string[]
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

    if (agreementIds)
      query.filter({
        field: "agreement.id",
        value: agreementIds,
        operator: "in",
      });

    return callProxy<StatementListResponse>(this.uiProxy, "/swo/statements/list", {
      query: query.toString(),
    });
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

    return callProxy<Statement>(this.uiProxy, "/swo/statements/get", {
      id,
      query: query.toString(),
    });
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

    return callProxy<ChargeListResponse>(this.uiProxy, "/swo/statements/charges", {
      statementId,
      query: query.toString(),
    });
  }
}
