import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { getUser } from "alga:extension/user";
import { logError } from "alga:extension/logging";
import { jsonResponse } from "../utils";

export const userHandler = (request: ExecuteRequest): ExecuteResponse => {
  if (request.http.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const user = getUser();
    return jsonResponse(user, { status: 200 });
  } catch (error) {
    logError(`Get User Error: ${error}`);
    return jsonResponse(
      {
        error: "User Error",
        message: "User information not available",
      },
      { status: 403 }
    );
  }
};
