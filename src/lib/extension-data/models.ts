export type ExtensionSettings = {
  endpoint: string;
  token: string;
  note: string;
};

export type ExtensionStatus = "unconfigured" | "active" | "disabled" | "error";
