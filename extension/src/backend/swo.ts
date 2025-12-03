import type { ExecuteRequest, HostBindings } from "@alga-psa/extension-runtime";

const getAPIBaseUrl = async (): Promise<string> => {
  return "https://chipmunk-relevant-externally.ngrok-free.app";
  // return "https://portal.s1.live/public/v1";
};

const getAPIToken = async (): Promise<string> => {
  return "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";
};

const toSWOUrl = (baseUrl: string, url: string): string => {
  return `${baseUrl}${url.replace("/swo", "")}`;
};

export const proxySWO = async <T>(
  request: ExecuteRequest,
  host: HostBindings
): Promise<T> => {
  const [baseUrl, token] = await Promise.all([getAPIBaseUrl(), getAPIToken()]);
  const url = toSWOUrl(baseUrl, request.http.url);

  console.log(token, url);

  const response = await host.http.fetch({
    method: "GET",
    url: "https://chipmunk-relevant-externally.ngrok-free.app/accounts/accounts",
    headers: [],
  });

  return { response: response.body?.toString() } as T;
};
