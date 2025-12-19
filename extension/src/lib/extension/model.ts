export type ExtensionStatus = "unconfigured" | "active" | "disabled";

export type ExtensionDetails = {
  endpoint?: string;
  token?: string;
  note?: string;
  status: ExtensionStatus;
  audit: {
    createdAt: string;
    updatedAt?: string;
    activatedAt?: string;
    disabledAt?: string;
  };
};
