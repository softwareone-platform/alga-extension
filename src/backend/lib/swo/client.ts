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
    url: string,
    method: "GET" | "POST" = "GET",
    body?: unknown,
  ): { data: T; headers: { name: string; value: string }[]; status: number } {
    const response = httpFetch({
      method,
      url: `${this.apiUrl}${url}`,
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
          `Failed to fetch from ${url}. SWO API returned ${
            response.status
          }:\n\n ${JSON.stringify(error, null, 2)}`,
        );
      } catch {
        throw new Error(
          `Failed to fetch from ${url}. SWO API returned ${response.status}`,
        );
      }
    }

    const decoded = decode<T>(response.body);
    if (!decoded) {
      throw new Error(
        `Failed to decode response from ${url}. SWO API returned ${response.status}`,
      );
    }

    return {
      data: decoded,
      headers: response.headers,
      status: response.status,
    };
  }
}
