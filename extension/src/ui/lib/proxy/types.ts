/**
 * Response from a proxy call
 */
export interface ProxyResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  upstreamStatus?: number;
}

/**
 * UI Proxy host interface - compatible with IframeBridge.uiProxy
 */
export interface UiProxyHost {
  call(route: string, payload?: Uint8Array): Promise<Uint8Array>;
}

/**
 * Bridge interface for the extension iframe
 */
export interface ExtensionBridge {
  uiProxy: UiProxyHost;
  ready(): void;
}
