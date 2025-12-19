import { ExtensionDetails } from "./model";

export type ExtensionRequestBody = Pick<
  ExtensionDetails,
  "endpoint" | "token" | "note"
>;

export type ExtensionResponseBody = ExtensionDetails;
