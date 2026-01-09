export type ExtensionStatus = "unconfigured" | "active" | "disabled";
export type ExtensionDetails = {
  endpoint: string;
  token: string;
  note?: string;
  status: ExtensionStatus;
  audit: {
    createdAt: string;
    updatedAt?: string;
    activatedAt?: string;
    disabledAt?: string;
  };
};

export type ExtensionDetailsChange = {
  endpoint?: string;
  token?: string;
  note?: string;
  status?: ExtensionStatus;
};

//API
export type ExtensionDetailsRequestBody = ExtensionDetailsChange;
export type ExtensionDetailsResponseBody = Omit<ExtensionDetails, "token"> & {
  hasToken: boolean;
};
