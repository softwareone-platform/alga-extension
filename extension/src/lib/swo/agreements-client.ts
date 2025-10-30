import { RqlQuery } from "@swo/rql-client";
import { AxiosInstance } from "axios";
import {
  Agreement,
  AgreementListResponse,
  Subscription,
  SubscriptionListResponse,
  Order,
  OrderListResponse,
} from "@swo/mp-api-model";
import { axiosInstance, ListOptions } from "./shared";

export type AgreementsClientAgreementsOptions = ListOptions<Agreement> & {
  licenseeId?: string;
};

export type AgreementsClientOrdersOptions = ListOptions<Order>;

export type AgreementsClientSubscriptionsOptions = ListOptions<Subscription>;

export class AgreementsClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axios = axiosInstance(baseUrl, token);
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

    const { data } = await this.axios.get<AgreementListResponse>(
      `/commerce/agreements?${query.toString()}`
    );
    return data;
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

    const { data } = await this.axios.get<Agreement>(
      `/commerce/agreements/${id}?${query.toString()}`
    );
    return data;
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

    const { data } = await this.axios.get<SubscriptionListResponse>(
      `/commerce/subscriptions?agreement.id=${agreementId}&${query.toString()}`
    );
    return data;
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

    const { data } = await this.axios.get<OrderListResponse>(
      `/commerce/orders?agreement.id=${agreementId}&${query.toString()}`
    );
    return data;
  }
}
