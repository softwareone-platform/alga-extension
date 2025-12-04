import type { ExecuteRequest, HostBindings } from "@alga-psa/extension-runtime";
import { UserType, checkRequestAllowed, filterResponse } from "./filter";
import { filters } from "./filters";

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

export const proxySWO = async <T>(
  request: ExecuteRequest,
  host: HostBindings
): Promise<T> => {
  const userType = await getUserType();

  const requestPath = new URL(request.http.url, "http://dummy").pathname;
  const filterResult = checkRequestAllowed(requestPath, userType, filters);

  if (!filterResult.allowed) {
    return {
      error: "Forbidden",
      code: "PATH_NOT_ALLOWED",
      message: filterResult.reason,
    } as T;
  }

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
    return { response: "" } as T;
  }

  let parsedResponse: unknown;
  try {
    parsedResponse = JSON.parse(responseBody);
  } catch {
    return { response: responseBody } as T;
  }

  const filteredData = filterResponse(
    parsedResponse,
    filterResult.allowedPath.filteredFields
  );

  return { response: JSON.stringify(filteredData) } as T;
};
