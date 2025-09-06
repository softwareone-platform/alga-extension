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
    };
  }

  async saveDetails(newDetails: Omit<ExtensionDetails, "status">) {
    const details = {
      ...newDetails,
      status:
        newDetails.token && newDetails.endpoint ? "active" : "unconfigured",
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
