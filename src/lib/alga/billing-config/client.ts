import { KVStorage } from "@lib/alga";
import { BillingConfig } from "./models";

const BY_AGREEMENTS_KEY = "billing-configs-by-agreements";
const BY_CUSTOMERS_KEY = "billing-configs-by-customers";
const MAX_ID_STORAGE_KEY = "max-id";

export type BillingConfigChanges = Omit<
  BillingConfig,
  "updatedAt" | "status" | "id"
> & {
  id?: string;
};

export class BillingConfigClient {
  private kvStorage: KVStorage;

  constructor(kvStorage: KVStorage) {
    this.kvStorage = kvStorage;
  }

  async getByAgreementId(agreementId: string): Promise<BillingConfig | null> {
    return await this.kvStorage.get<BillingConfig>(
      `${BY_AGREEMENTS_KEY}:${agreementId}`
    );
  }

  async getByAgreementsIds(agreementsIds: string[]): Promise<BillingConfig[]> {
    // TODO: Temp
    return await Promise.all(
      agreementsIds.map((id) => this.getByAgreementId(id))
    ).then((bcs) => bcs.filter((bc) => !!bc));
  }

  async getByCustomerId(customerId: string): Promise<BillingConfig[]> {
    const current = await this.kvStorage.get<BillingConfig[]>(
      `${BY_CUSTOMERS_KEY}:${customerId}`
    );

    return current || [];
  }

  async save(changes: BillingConfigChanges): Promise<BillingConfig> {
    const bc: BillingConfig = {
      id: changes.id || (await this.generateId()),
      status: changes.consumer ? "active" : "unconfigured",
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    await this.kvStorage.set(`${BY_AGREEMENTS_KEY}:${bc.agreementId}`, bc);

    if (!bc.consumer) {
      return bc;
    }

    const current =
      (await this.kvStorage.get<BillingConfig[]>(
        `${BY_CUSTOMERS_KEY}:${bc.consumer.id}`
      )) || [];

    current.push(bc);

    await this.kvStorage.set(`${BY_CUSTOMERS_KEY}:${bc.consumer.id}`, current);

    return bc;
  }

  private async generateId(): Promise<string> {
    const maxId = (await this.kvStorage.get<number>(MAX_ID_STORAGE_KEY)) || 1;

    const newId = maxId + 1;

    await this.kvStorage.set(MAX_ID_STORAGE_KEY, newId);

    const paddedStr = newId.toString().padStart(8, "0");

    return `ARL-${paddedStr.slice(0, 4)}-${paddedStr.slice(4)}`;
  }
}
