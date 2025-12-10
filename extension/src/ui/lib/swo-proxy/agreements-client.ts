import { RqlQuery } from "@swo/rql-client";
import {
  Agreement,
  AgreementListResponse,
  Subscription,
  SubscriptionListResponse,
  Order,
  OrderListResponse,
} from "@swo/mp-api-model";
import { callProxy, type UiProxyHost } from "@lib/proxy";
import { ListOptions, ProxyClientConfig } from "./shared";

export type AgreementsClientAgreementsOptions = ListOptions<Agreement> & {
  licenseeId?: string;
};

export type AgreementsClientOrdersOptions = ListOptions<Order>;

export type AgreementsClientSubscriptionsOptions = ListOptions<Subscription>;

export class AgreementsClient {
  private uiProxy: UiProxyHost;

  constructor(config: ProxyClientConfig) {
    this.uiProxy = config.uiProxy;
  }

  async getAgreements(
    options?: AgreementsClientAgreementsOptions,
    ids?: string[]
  ): Promise<AgreementListResponse> {
    const { offset = 0, limit = 10, sort, licenseeId } = options || {};

    const query = new RqlQuery<Agreement>();

    query
      .expand(
        "id",
        "name",
        "product.id",
        "product.name",
        "product.icon",
        "licensee.id",
        "licensee.name",
        "price.SPxM",
        "price.SPxY",
        "price.currency",
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

    if (ids)
      query.filter({
        field: "id",
        value: ids,
        operator: "in",
      });

    return callProxy<AgreementListResponse>(this.uiProxy, "/swo/agreements/list", {
      query: query.toString(),
    });
  }

  async getAgreement(id: string): Promise<Agreement | null> {
    const query = new RqlQuery<Agreement>();

    query
      .expand(
        "id",
        "name",
        "product.id",
        "product.name",
        "product.icon",
        "licensee.id",
        "licensee.name",
        "price.SPxM",
        "price.SPxY",
        "price.currency",
        "audit",
        "seller.id",
        "seller.name",
        "seller.address"
      )
      .exclude("subscriptions", "lines");

    return callProxy<Agreement>(this.uiProxy, "/swo/agreements/get", {
      id,
      query: query.toString(),
    });
  }

  async getSubscriptions(
    agreementId: string,
    options?: AgreementsClientSubscriptionsOptions
  ): Promise<SubscriptionListResponse> {
    const { offset = 0, limit = 10, sort } = options || {};

    const query = new RqlQuery<Subscription>();

    query
      .expand(
        "id",
        "name",
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

    return callProxy<SubscriptionListResponse>(this.uiProxy, "/swo/subscriptions/list", {
      query: `agreement.id=${agreementId}&${query.toString()}`,
    });
  }

  async getOrders(
    agreementId: string,
    options?: AgreementsClientOrdersOptions
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
      .orderBy([sort?.by || "audit.created.at", sort?.order || "desc"])
      .paging(offset, limit);

    return callProxy<OrderListResponse>(this.uiProxy, "/swo/orders/list", {
      query: `agreement.id=${agreementId}&${query.toString()}`,
    });
  }
}
