import { ExtensionDetails } from "./model";

export type ExtensionRequestBody = Pick<
  ExtensionDetails,
  "endpoint" | "token" | "note"
> & {
  status?: "active" | "disabled";
};

export type ExtensionResponseBody = Omit<ExtensionDetails, "token"> & {
  hasToken: boolean;
};
