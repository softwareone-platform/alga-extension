import { RqlQuery } from "@swo/rql-client";
import { AxiosInstance } from "axios";
import {
  Subscription as SubscriptionModel,
  SubscriptionListResponse,
  Order,
  OrderListResponse,
} from "@swo/mp-api-model";
import { axiosInstance, ListOptions } from "./shared";

export type Subscription = SubscriptionModel;

export type SubscriptionsClientSubscriptionsOptions =
  ListOptions<SubscriptionModel> & {
    licenseeId?: string;
  };

export type SubscriptionsClientOrdersOptions = ListOptions<Order>;

export class SubscriptionsClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axios = axiosInstance(baseUrl, token);
  }

  async getSubscriptions(
    options?: SubscriptionsClientSubscriptionsOptions,
    agreementIds?: string[]
  ): Promise<SubscriptionListResponse> {
    const { offset = 0, limit = 10, sort, licenseeId } = options || {};

    const query = new RqlQuery<SubscriptionModel>();

    query
      .expand(
        "id",
        "name",
        "agreement.id",
        "agreement.name",
        "product.id",
        "product.name",
        "product.icon",
        "licensee.id",
        "licensee.name",
        "agreement.id",
        "agreement.name",
        "price.SPxM",
        "price.SPxY",
        "price.currency",
        "terms.period",
        "terms.commitment",
        "status",
        "audit"
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

    const { data } = await this.axios.get<SubscriptionListResponse>(
      `/commerce/subscriptions?${query.toString()}`
    );

    return data;
  }

  async getSubscription(id: string): Promise<SubscriptionModel> {
    const query = new RqlQuery<SubscriptionModel>();

    query.expand(
      "id",
      "name",
      "agreement.id",
      "agreement.name",
      "product.id",
      "product.name",
      "product.icon",
      "licensee.id",
      "licensee.name",
      "agreement.id",
      "agreement.name",
      "price.SPxM",
      "price.SPxY",
      "price.currency",
      "terms.period",
      "terms.commitment",
      "lines.id",
      "lines.item.id",
      "lines.item.name",
      "lines.item.unit.name",
      "lines.item.terms.period",
      "lines.item.terms.commitment",
      "lines.quantity",
      "lines.price.SPxM",
      "lines.price.SPxY",
      "lines.price.currency",
      "lines.price.unitSP",
      "lines.status",
      "status",
      "audit"
    );

    const { data } = await this.axios.get<SubscriptionModel>(
      `/commerce/subscriptions/${id}?${query.toString()}`
    );
    return data;
  }

  async getOrders(
    subscriptionId: string,
    options?: SubscriptionsClientOrdersOptions
  ): Promise<OrderListResponse> {
    const { offset = 0, limit = 10, sort } = options || {};

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
        "price.SPxM",
        "price.SPxY",
        "price.currency",
        "status",
        "audit"
      )
      .applyNamedFilter("group.buyers")
      .filter(
        query.operators.any("subscriptions" as any, {
          field: "id",
          value: subscriptionId,
          operator: "eq",
        })
      )
      .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
      .paging(offset, limit);

    const { data } = await this.axios.get<OrderListResponse>(
      `/commerce/orders?${query.toString()}`
    );
    return data;
  }

  async terminateSubscription(id: string, notes?: string): Promise<void> {
    const query = new RqlQuery<SubscriptionModel>();

    query.expand("agreement.id");

    const { data: subscription } = await this.axios.get<SubscriptionModel>(
      `/commerce/subscriptions/${id}?${query.toString()}`
    );

    const agreementId = subscription.agreement?.id;
    if (!agreementId) {
      throw new Error("Subscription does not have an agreement");
    }

    const { data: order } = await this.axios.post<Order>(`/commerce/orders`, {
      status: "Draft",
      type: "Termination",
      agreement: { id: agreementId },
      subscriptions: [{ id }],
      notes,
    });

    await this.axios.post(`/commerce/orders/${order.id!}/process`, {
      type: "Termination",
    });
  }
}
