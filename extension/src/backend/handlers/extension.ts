import {
  ExtensionDetailsRequestBody,
  ExtensionDetailsResponseBody,
} from "@/shared/extension-details";
import { extension } from "../features";
import { defineHandler } from "../engine";

defineHandler<unknown, ExtensionDetailsResponseBody>(
  "GET",
  "/extension",
  ({ extensionDetails: { token, ...rest } }) => {
    return {
      status: 200,
      body: {
        ...rest,
        hasToken: !!token,
      },
    };
  },
);

defineHandler<ExtensionDetailsRequestBody, ExtensionDetailsResponseBody>(
  "POST",
  "/extension",
  ({ body: change }) => {
    if (!change) {
      return { status: 400, error: "Invalid request body" };
    }

    const { token, ...rest } = extension.saveDetails(change!);
    return {
      status: 202,
      body: {
        ...rest,
        hasToken: token ? true : false,
      },
    };
  },
);
