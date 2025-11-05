import type { KVStorage } from "../kv-storage";
import type { ExtensionDetails } from "./models";

const SETTINGS_STORAGE_KEY = "settings";

export type ExtensionDetailsChanges = Omit<
  ExtensionDetails,
  "status" | "audit"
>;

type ExtensionDetailsKV = Omit<ExtensionDetails, "audit"> & {
  audit: {
    activatedAt?: string;
    disabledAt?: string;
  };
};

export class ExtensionClient {
  private kvStorage: KVStorage;

  constructor(kvStorage: KVStorage) {
    this.kvStorage = kvStorage;
  }

  async getDetails(): Promise<ExtensionDetails | null> {
    const result = await this.kvStorage.get<ExtensionDetailsKV>(
      SETTINGS_STORAGE_KEY
    );
    return result?.value
      ? {
          ...result.value,
          audit: {
            ...result.value.audit,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          },
        }
      : null;
  }
}
