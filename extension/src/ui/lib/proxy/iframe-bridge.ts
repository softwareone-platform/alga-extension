import type { UiProxyHost } from "./types";

const ENVELOPE_VERSION = "1";

/**
 * Production bridge that uses postMessage to communicate with the Alga host.
 * The host forwards requests to the WASM handler, which makes the actual HTTP calls.
 */
export class IframeBridge {
  private pendingRequests = new Map<
    string,
    { resolve: (value: Uint8Array) => void; reject: (reason: Error) => void }
  >();

  constructor() {
    this.setupMessageListener();
  }

  private setupMessageListener(): void {
    window.addEventListener("message", (ev) => {
      const data = ev.data;
      if (!data || typeof data !== "object") return;
      if (data.alga !== true || data.version !== ENVELOPE_VERSION) return;

      if (data.type === "apiproxy_response") {
        const requestId = data.request_id;
        const pending = this.pendingRequests.get(requestId);
        if (pending) {
          this.pendingRequests.delete(requestId);
          if (data.payload.error) {
            pending.reject(new Error(data.payload.error));
          } else {
            // Decode base64 body to Uint8Array
            const bodyBase64 = data.payload.body || "";
            try {
              const binaryString = atob(bodyBase64);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              pending.resolve(bytes);
            } catch {
              pending.reject(new Error("Failed to decode proxy response"));
            }
          }
        }
      }
    });
  }

  get uiProxy(): UiProxyHost {
    return {
      call: async (route: string, payload?: Uint8Array): Promise<Uint8Array> => {
        return new Promise((resolve, reject) => {
          const requestId = crypto.randomUUID();

          // Store pending request
          this.pendingRequests.set(requestId, { resolve, reject });

          // Encode payload as base64 if provided
          let bodyBase64: string | undefined;
          if (payload !== undefined) {
            let binaryString = "";
            for (let i = 0; i < payload.length; i++) {
              binaryString += String.fromCharCode(payload[i]);
            }
            bodyBase64 = btoa(binaryString);
          }

          // Send apiproxy message to host
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(
              {
                alga: true,
                version: ENVELOPE_VERSION,
                type: "apiproxy",
                request_id: requestId,
                payload: { route, body: bodyBase64 },
              },
              "*"
            );
          } else {
            this.pendingRequests.delete(requestId);
            reject(new Error("Not running in an iframe"));
            return;
          }

          // Timeout after 30 seconds
          setTimeout(() => {
            if (this.pendingRequests.has(requestId)) {
              this.pendingRequests.delete(requestId);
              reject(new Error("Proxy request timed out"));
            }
          }, 30000);
        });
      },
    };
  }

  ready(): void {
    if (window.parent && window.parent !== window) {
      console.log("[IframeBridge] Signaling ready to host");
      window.parent.postMessage(
        {
          alga: true,
          version: ENVELOPE_VERSION,
          type: "ready",
          payload: {},
        },
        "*"
      );
    }
  }
}
