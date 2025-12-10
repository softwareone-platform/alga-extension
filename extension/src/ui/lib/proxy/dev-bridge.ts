import type { UiProxyHost } from "./types";
import { IframeBridge } from "./iframe-bridge";

/**
 * Create a bridge instance using postMessage to communicate with the Alga host.
 */
export function createBridge(): { uiProxy: UiProxyHost; ready: () => void } {
  return new IframeBridge();
}
