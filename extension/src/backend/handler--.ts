//ALGA TESTING

import "./polyfill";

import { logError } from "alga:extension/logging";
import type {
  ExecuteRequest,
  ExecuteResponse,
} from "@alga-psa/extension-runtime";
import { decode, encode, jsonResponse } from "./lib/alga/utils";
import {
  put as putStorage,
  get as getStorage,
  StorageEntry,
} from "alga:extension/storage";

export function handler(request: ExecuteRequest): ExecuteResponse {
  const someData = { ok: true };
  let encodedData: Uint8Array;
  //ENCODE TEST
  try {
    encodedData = encode(someData);
  } catch (error) {
    const message = "encode failed: " + error;
    logError(`Error: ${message}`);

    return jsonResponse(
      {
        error: "Internal Server Error",
        message: message,
        requestUrl: request.http.url,
      },
      { status: 500 }
    );
  }

  // PUT STORAGE TEST
  try {
    putStorage({
      namespace: "namespace",
      key: "key",
      value: encodedData,
    });
  } catch (error) {
    const message = "putStorage failed: " + error;
    logError(`Error: ${message}`);

    return jsonResponse(
      {
        error: "Internal Server Error",
        message: message,
        requestUrl: request.http.url,
      },
      { status: 500 }
    );
  }

  // GET STORAGE TEST
  let entry: StorageEntry;
  try {
    entry = getStorage("namespace", "key");
  } catch (error) {
    const message = "getStorage failed: " + error;
    logError(`Error: ${message}`);

    return jsonResponse(
      {
        error: "Internal Server Error",
        message: "putStorage failed: " + error,
        requestUrl: request.http.url,
      },
      { status: 500 }
    );
  }

  let data: unknown;
  try {
    data = decode(entry.value);
  } catch (error) {
    const message = "decode failed: " + error;
    logError(`Error: ${message}`);

    return jsonResponse(
      {
        error: "Internal Server Error",
        message: message,
        requestUrl: request.http.url,
      },
      { status: 500 }
    );
  }

  return jsonResponse({ data }, { status: 200 });
}
