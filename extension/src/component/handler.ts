// import { Handler, jsonResponse } from "@alga/extension-runtime";

export const handler: any = async (req: any, host: any) => {
  const secret = await host.secrets.get("api_key");
  return secret;
};
