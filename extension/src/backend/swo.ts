const getAPIBaseUrl = async (): Promise<string> => {
  return "https://portal.s1.live/public/v1";
};

const getAPIToken = async (): Promise<string> => {
  return "idt:TKN-8557-7823:Rv3ltKu4js3bVvR6Ok6n0JmIfruCTusirs1nI1UDF3T4AzuiHPPkuMG90gHAsNrR";
};

const toSWOUrl = (baseUrl: string, url: string): string => {
  const { pathname, search } = new URL(url);
  return `${baseUrl}${pathname}?${search}`;
};

const proxyMSP = async <T>(url: string): Promise<T> => {
  const [baseUrl, token] = await Promise.all([getAPIBaseUrl(), getAPIToken()]);
  const swoUrl = toSWOUrl(baseUrl, url);

  const response = await fetch(swoUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const proxySWO = async <T>(url: string): Promise<T> => {
  return proxyMSP<T>(url);
};
