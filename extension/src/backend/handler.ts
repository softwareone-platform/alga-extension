import "./polyfill";

import {
  type ExecuteRequest,
  type ExecuteResponse,
  type HostBindings,
} from "@alga-psa/extension-runtime";
import { jsonResponse } from "./utils";
// import { handleSWO } from "./swo";

export async function handler(
  _: ExecuteRequest,
  host: HostBindings
): Promise<ExecuteResponse> {
  await host.logging.info(`test log`);

  // try {
  //   await host.logging.info(`test log`);

  //   const response = await host.http.fetch({
  //     method: "GET",
  //     url: "https://google.com",
  //     headers: [],
  //   });
  //   return jsonResponse(
  //     {
  //       message: "test message",
  //     },
  //     { status: response.status }
  //   );
  // } catch (error) {
  //   await host.logging.error(`[service-proxy-demo] error: ${error}`);
  // }

  return jsonResponse(
    {
      message: "DONE",
    },
    { status: 200 }
  );
}
