import { KVStorage } from "@lib/alga";
import { ExtensionDetails } from "./models";

const SETTINGS_STORAGE_KEY = "settings";

export type ExtensionDetailsChanges = Omit<
  ExtensionDetails,
  "status" | "createdAt" | "updatedAt" | "activatedAt" | "disabledAt"
>;

export class ExtensionClient {
  private kvStorage: KVStorage;

  constructor(kvStorage: KVStorage) {
    this.kvStorage = kvStorage;
  }

  async getDetails(): Promise<ExtensionDetails | null> {
    return await this.kvStorage.get<ExtensionDetails>(SETTINGS_STORAGE_KEY);
  }

  async saveDetails(newDetails: ExtensionDetailsChanges) {
    const isComplete = newDetails.token && newDetails.endpoint;

    const oldDetails = await this.getDetails();

    const details = {
      ...oldDetails,
      ...newDetails,
      status: isComplete ? "active" : "unconfigured",
      createdAt: oldDetails?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activatedAt: isComplete ? new Date().toISOString() : "",
    };

    await this.kvStorage.set(SETTINGS_STORAGE_KEY, details);

    return details;
  }

  async disable(note?: string) {
    const details = await this.getDetails();
    const newDetails = {
      ...details,
      note: note || "",
      status: "disabled",
      disabledAt: new Date().toISOString(),
    };

    await this.kvStorage.set(SETTINGS_STORAGE_KEY, newDetails);
  }

  async enable(note?: string) {
    const details = await this.getDetails();
    const newDetails = {
      ...details,
      note: note || "",
      status: "active",
      activatedAt: new Date().toISOString(),
    };

    await this.kvStorage.set(SETTINGS_STORAGE_KEY, newDetails);
  }
}
