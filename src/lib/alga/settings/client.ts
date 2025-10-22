import { KVStorage } from "@lib/alga";
import { ExtensionDetails } from "./models";

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

  async saveDetails(
    changes: ExtensionDetailsChanges
  ): Promise<ExtensionDetails> {
    const isConfigured = changes.token && changes.endpoint;

    const oldDetails = await this.getDetails();
    const { audit, ...rest } = oldDetails || {};

    const update: ExtensionDetailsKV = {
      ...rest,
      ...changes,
      status: isConfigured ? "active" : "unconfigured",
      audit: {
        activatedAt: isConfigured
          ? new Date().toISOString()
          : audit?.activatedAt,
        disabledAt: audit?.disabledAt,
      },
    };

    const result = await this.kvStorage.set(SETTINGS_STORAGE_KEY, update);

    return {
      ...result.value,
      audit: {
        ...result.value.audit,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }

  async disable(note?: string) {
    const details = await this.getDetails();
    if (!details) {
      throw new Error("Extension details not found");
    }

    const update: ExtensionDetailsKV = {
      ...details,
      note: note || "",
      status: "disabled",
      audit: {
        activatedAt: details.audit?.activatedAt,
        disabledAt: new Date().toISOString(),
      },
    };

    await this.kvStorage.set(SETTINGS_STORAGE_KEY, update);
  }

  async enable(note?: string) {
    const details = await this.getDetails();
    if (!details) {
      throw new Error("Extension details not found");
    }

    const update: ExtensionDetailsKV = {
      ...details,
      note: note || "",
      status: "disabled",
      audit: {
        disabledAt: details.audit?.disabledAt,
        activatedAt: new Date().toISOString(),
      },
    };

    await this.kvStorage.set(SETTINGS_STORAGE_KEY, update);
  }
}
