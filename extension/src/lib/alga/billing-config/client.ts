import { KVStorage } from "@lib/alga";
import { BillingConfig } from "./models";
import { CredentialsClient } from "@lib/swo";

const BY_AGREEMENT = "billing-configs-by-agreement";
const BY_CONSUMER = "billing-configs-by-consumer";

export type BillingConfigChanges = Omit<
  BillingConfig,
  "audit" | "status" | "id"
> & {
  id?: string;
};

type BillingConfigKV = Omit<BillingConfig, "audit" | "status">;

export class BillingConfigClient {
  private kvStorage: KVStorage;
  private credentialsClient: CredentialsClient;

  constructor(kvStorage: KVStorage, credentialsClient: CredentialsClient) {
    this.kvStorage = kvStorage;
    this.credentialsClient = credentialsClient;
  }

  async getByAgreementId(agreementId: string): Promise<BillingConfig | null> {
    const result = await this.kvStorage.get<BillingConfigKV>(
      `${BY_AGREEMENT}-${agreementId}-${agreementId}`
    );

    return result?.value
      ? {
          ...result.value,
          status: result.value.consumer ? "active" : "unconfigured",
          audit: {
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          },
        }
      : null;
  }

  async getByConsumerId(consumerId: string): Promise<BillingConfig[]> {
    const result = await this.kvStorage.list<BillingConfigKV>({
      keyPrefix: `${BY_CONSUMER}-${consumerId}`,
    });

    console.log(result);

    return result.map((v) => ({
      ...v.value,
      status: v.value.consumer ? "active" : "unconfigured",
      audit: {
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      },
    }));
  }

  async save(changes: BillingConfigChanges): Promise<BillingConfig> {
    const bcKV: BillingConfigKV = {
      id: changes.id || changes.agreementId,
      ...changes,
    };

    const result = await this.kvStorage.set(
      `${BY_AGREEMENT}-${bcKV.agreementId}-${bcKV.agreementId}`,
      bcKV
    );

    const status = bcKV.consumer ? "active" : "unconfigured";

    if (status === "active") {
      await Promise.all([
        this.kvStorage.set(
          `${BY_CONSUMER}-${bcKV.consumer!.id}-${bcKV.agreementId}`,
          bcKV
        ),
        this.credentialsClient.upsert(bcKV.agreementId),
      ]);
    }

    if (status === "unconfigured") {
      const current = await this.getByAgreementId(bcKV.agreementId);
      if (current?.consumer?.id)
        await Promise.all([
          this.kvStorage.remove(
            `${BY_CONSUMER}-${current?.consumer?.id}-${current.agreementId}`
          ),
          this.credentialsClient.delete(current.agreementId),
        ]);
    }

    return {
      ...bcKV,
      status,
      audit: {
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }
}
