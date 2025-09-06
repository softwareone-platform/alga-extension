import { ExtensionDetails } from "./models";

const SETTINGS_STORAGE_KEY = "SWO-SETTINGS";

export type ExtensionDetailsChanges = Omit<
  ExtensionDetails,
  "status" | "createdAt" | "updatedAt" | "activatedAt" | "disabledAt"
>;

export class ExtensionClient {
  constructor() {}

  async getDetails(): Promise<ExtensionDetails> {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      endpoint: "",
      token: "",
      note: "",
      status: "",
      createdAt: "",
      updatedAt: "",
      activatedAt: "",
      disabledAt: "",
    };
  }

  async saveDetails(newDetails: ExtensionDetailsChanges) {
    const isComplete = newDetails.token && newDetails.endpoint;

    const oldDetails = await this.getDetails();

    const details = {
      ...oldDetails,
      ...newDetails,
      status: isComplete ? "active" : "unconfigured",
      createdAt: oldDetails.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activatedAt: isComplete ? new Date().toISOString() : "",
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(details));

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

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newDetails));
  }

  async enable(note?: string) {
    const details = await this.getDetails();
    const newDetails = {
      ...details,
      note: note || "",
      status: "active",
      activatedAt: new Date().toISOString(),
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newDetails));
  }
}
