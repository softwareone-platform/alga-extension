import { ExtensionSettings, ExtensionStatus } from "./models";

const SETTINGS_STORAGE_KEY = "SWO-SETTINGS";
const STATUS_STORAGE_KEY = "SWO-STATUS";

export class ExtensionDataClient {
  constructor() {}

  async getSettings(): Promise<ExtensionSettings> {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      endpoint: "",
      token: "",
      note: "",
    };
  }

  async saveSettings(settings: ExtensionSettings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));

    if (settings.token && settings.endpoint) {
      localStorage.setItem(STATUS_STORAGE_KEY, "active");
    } else {
      localStorage.setItem(STATUS_STORAGE_KEY, "unconfigured");
    }
  }

  async getStatus(): Promise<ExtensionStatus> {
    return (
      (localStorage.getItem(STATUS_STORAGE_KEY) as ExtensionStatus) ||
      "unconfigured"
    );
  }

  async disable() {
    localStorage.setItem(STATUS_STORAGE_KEY, "disabled");
  }

  async enable() {
    localStorage.setItem(STATUS_STORAGE_KEY, "active");
  }
}
