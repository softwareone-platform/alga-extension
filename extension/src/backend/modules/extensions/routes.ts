import {
  ExtensionDetailsRequestBody,
  ExtensionDetailsResponseBody,
} from "@/shared/extension-details";
import { route } from "@/backend/routing";
import { extension } from "@/backend/extension";

route<unknown, ExtensionDetailsResponseBody>(
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

route<ExtensionDetailsRequestBody, ExtensionDetailsResponseBody>(
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
  false,
);
