import type {
  ExecuteRequest,
  ExecuteResponse,
  HostBindings,
} from "@alga-psa/extension-runtime";
import { UserType, filterResponse, getRule } from "./filter";
import { filters } from "./filters";
import { jsonResponse } from "./utils";

const getAPIBaseUrl = async (): Promise<string> => {
  return "https://chipmunk-relevant-externally.ngrok-free.app";
  // return "https://portal.s1.live/public/v1";
};

const getAPIToken = async (): Promise<string> => {
  return "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";
};

const getUserType = async (): Promise<UserType> => {
  return "msp";
};

const toSWOUrl = (baseUrl: string, url: string): string => {
  return `${baseUrl}${url.replace("/swo", "")}`;
};

export const handleSWO = async (
  request: ExecuteRequest,
  host: HostBindings
): Promise<ExecuteResponse> => {
  const userType = await getUserType();

  const requestPath = new URL(request.http.url, "http://dummy").pathname;
  const rule = getRule(requestPath, userType, filters);

  if (!rule)
    return jsonResponse(
      {
        error: "Forbidden",
        message: `Request not allowed for user type ${userType}: ${requestPath}`,
      },
      { status: 403 }
    );

  const [baseUrl, token] = await Promise.all([getAPIBaseUrl(), getAPIToken()]);
  const url = toSWOUrl(baseUrl, request.http.url);

  const response = await host.http.fetch({
    method: "GET",
    url,
    headers: [
      { name: "Authorization", value: `Bearer ${token}` },
      { name: "Content-Type", value: "application/json" },
    ],
  });

  const responseBody = response.body?.toString();
  if (!responseBody) {
    return jsonResponse({}, { status: response.status });
  }

  const body = filterResponse(JSON.parse(responseBody), rule);

  return jsonResponse(body, { status: response.status });
};
