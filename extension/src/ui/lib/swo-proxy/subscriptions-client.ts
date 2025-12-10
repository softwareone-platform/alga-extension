import { RqlQuery } from "@swo/rql-client";
import {
  Subscription,
  SubscriptionListResponse,
  Order,
  OrderListResponse,
} from "@swo/mp-api-model";
import { callProxy, type UiProxyHost } from "@lib/proxy";
import { ListOptions, ProxyClientConfig } from "./shared";

export type SubscriptionsClientSubscriptionsOptions =
  ListOptions<Subscription> & {
    licenseeId?: string;
  };

export type SubscriptionsClientOrdersOptions = ListOptions<Order>;

export class SubscriptionsClient {
  private uiProxy: UiProxyHost;

  constructor(config: ProxyClientConfig) {
    this.uiProxy = config.uiProxy;
  }

  async getSubscriptions(
    options?: SubscriptionsClientSubscriptionsOptions,
    agreementIds?: string[]
  ): Promise<SubscriptionListResponse> {
    const { offset = 0, limit = 10, sort, licenseeId } = options || {};

    const query = new RqlQuery<Subscription>();

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

    return callProxy<SubscriptionListResponse>(this.uiProxy, "/swo/subscriptions/list", {
      query: query.toString(),
    });
  }

  async getSubscription(id: string): Promise<Subscription> {
    const query = new RqlQuery<Subscription>();

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

    return callProxy<Subscription>(this.uiProxy, "/swo/subscriptions/get", {
      id,
      query: query.toString(),
    });
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

    return callProxy<OrderListResponse>(this.uiProxy, "/swo/orders/list", {
      query: query.toString(),
    });
  }

  async terminateSubscription(id: string, notes?: string): Promise<void> {
    const query = new RqlQuery<Subscription>();
    query.expand("agreement.id");

    const subscription = await callProxy<Subscription>(this.uiProxy, "/swo/subscriptions/get", {
      id,
      query: query.toString(),
    });

    const agreementId = subscription.agreement?.id;
    if (!agreementId) {
      throw new Error("Subscription does not have an agreement");
    }

    const order = await callProxy<Order>(this.uiProxy, "/swo/orders/create", {
      body: {
        status: "Draft",
        type: "Termination",
        agreement: { id: agreementId },
        subscriptions: [{ id }],
        notes,
      },
    });

    await callProxy(this.uiProxy, "/swo/orders/process", {
      id: order.id!,
      body: { type: "Termination" },
    });
  }
}
