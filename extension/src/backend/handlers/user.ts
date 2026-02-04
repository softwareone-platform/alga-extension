import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { getUser } from "alga:extension/user";
import { jsonResponse } from "../lib";

export const userHandler = (request: ExecuteRequest): ExecuteResponse => {
  if (request.http.method === "GET") {
    try {
      const user = getUser();
      return jsonResponse(user, { status: 200 });
    } catch (error) {
      return jsonResponse(
        { error: "Internal server error: " + error },
        { status: 500 }
      );
    }
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
