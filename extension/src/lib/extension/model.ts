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

export type ExtensionDetailsChange = Pick<
  ExtensionDetails,
  "endpoint" | "token" | "note"
> & {
  status?: "active" | "disabled";
};
