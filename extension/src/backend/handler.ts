import type {
  ExecuteRequest,
  ExecuteResponse,
  HostBindings,
} from "@alga-psa/extension-runtime";
import { handleSWO } from "./swo";

export async function handler(
  request: ExecuteRequest,
  host: HostBindings
): Promise<ExecuteResponse> {
  // const secret = await host.secrets.list();
  // const path = new URL(request.http.url).pathname;

  return handleSWO(request, host);
}
