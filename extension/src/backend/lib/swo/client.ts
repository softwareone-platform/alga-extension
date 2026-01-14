import { fetch as httpFetch } from "alga:extension/http";
import { decode, encode } from "../utils";

export class SWOClient {
  private token: string;
  private apiUrl: string;

  constructor(apiUrl: string, token: string) {
    this.token = token;
    this.apiUrl = apiUrl;
  }

  fetch<T>(
    path: string,
    rql: string,
    method: "GET" | "POST" = "GET",
    body?: unknown
  ): T {
    const response = httpFetch({
      method,
      url: `${this.apiUrl}${path}?${rql}`,
      headers: [
        { name: "Authorization", value: `Bearer ${this.token}` },
        { name: "Content-Type", value: "application/json" },
      ],
      body: body ? encode(body) : undefined,
    });

    if (response.status >= 400) {
      try {
        const error = decode<any>(response.body);
        throw new Error(
          `Failed to fetch from ${path}. SWO API returned ${
            response.status
          }:\n\n ${JSON.stringify(error, null, 2)}`
        );
      } catch {
        throw new Error(
          `Failed to fetch from ${path}. SWO API returned ${response.status}`
        );
      }
    }

    const decoded = decode<T>(response.body);
    if (!decoded) {
      throw new Error(
        `Failed to decode response from ${path}. SWO API returned ${response.status}`
      );
    }

    return decoded;
  }
}
