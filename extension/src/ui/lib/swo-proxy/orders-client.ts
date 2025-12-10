import { RqlQuery } from "@swo/rql-client";
import { Order, OrderListResponse } from "@swo/mp-api-model";
import { callProxy, type UiProxyHost } from "@lib/proxy";
import { ListOptions, ProxyClientConfig } from "./shared";

export type OrdersClientOrdersOptions = ListOptions<Order> & {
  licenseeId?: string;
};

export class OrdersClient {
  private uiProxy: UiProxyHost;

  constructor(config: ProxyClientConfig) {
    this.uiProxy = config.uiProxy;
  }

  async getOrders(
    options?: OrdersClientOrdersOptions,
    agreementIds?: string[]
  ): Promise<OrderListResponse> {
    const { offset = 0, limit = 10, sort, licenseeId } = options || {};

    const query = new RqlQuery<Order>();

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
        "price.SPxY",
        "audit",
        "status"
      )
      .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
      .paging(offset, limit);

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

    return callProxy<OrderListResponse>(this.uiProxy, "/swo/orders/list", {
      query: query.toString(),
    });
  }

  async getOrder(id: string): Promise<Order> {
    const query = new RqlQuery<Order>();

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
      "price.SPxM",
      "price.SPxY",
      "audit",
      "status",
      "lines.item.id",
      "lines.item.name",
      "lines.quantity",
      "lines.item.unit.name",
      "lines.item.terms.period",
      "lines.price.SPxM",
      "lines.price.SPxY",
      "lines.price.currency",
      "lines.item.status"
    );

    return callProxy<Order>(this.uiProxy, "/swo/orders/get", {
      id,
      query: query.toString(),
    });
  }
}
