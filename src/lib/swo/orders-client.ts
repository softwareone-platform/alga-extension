import { RqlQuery } from "@swo/rql-client";
import { AxiosInstance, AxiosResponse } from "axios";
import { Order, OrderListResponse } from "@swo/mp-api-model";
import { axiosInstance, ListOptions } from "./shared";

export type OrdersClientOrdersOptions = ListOptions<Order> & {
  licenseeId?: string;
};

export class OrdersClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axios = axiosInstance(baseUrl, token);
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

    const { data }: AxiosResponse<OrderListResponse> = await this.axios.get(
      `/commerce/orders?${query.toString()}`
    );
    return data;
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

    const { data }: AxiosResponse<Order> = await this.axios.get(
      `/commerce/orders/${id}?${query.toString()}`
    );

    return data;
  }
}
