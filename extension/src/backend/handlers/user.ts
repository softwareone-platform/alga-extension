import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "../lib/alga/utils";
import { UsersService } from "../services/users";

export const userHandler = (request: ExecuteRequest): ExecuteResponse => {
  if (request.http.method === "GET") {
    const user = new UsersService().getUser();
    return jsonResponse(user, { status: 200 });
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};
