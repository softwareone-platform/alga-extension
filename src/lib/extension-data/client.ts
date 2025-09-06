import { ExtensionDetails } from "./models";

const SETTINGS_STORAGE_KEY = "SWO-SETTINGS";

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

  async saveDetails(newDetails: Omit<ExtensionDetails, "status">) {
    const isComplete = newDetails.token && newDetails.endpoint;
    const details = {
      ...newDetails,
      status: isComplete ? "active" : "unconfigured",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(details));

    return details;
  }

  async disable() {
    const details = await this.getDetails();
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        ...details,
        status: "disabled",
      })
    );
  }

  async enable() {
    const details = await this.getDetails();
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        ...details,
        status: "active",
      })
    );
  }
}
