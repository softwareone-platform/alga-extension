declare module "alga:extension/logging" {
  export function logInfo(message: string): void;
  export function logWarn(message: string): void;
  export function logError(message: string): void;
}

declare module "alga:extension/secrets" {
  export type SecretError = "missing" | "denied" | "expired" | "internal";
  export function get(key: string): string; // throws SecretError on failure
  export function listKeys(): string[];
}

declare module "alga:extension/http" {
  export interface HttpHeader {
    name: string;
    value: string;
  }
  export interface HttpRequest {
    method: string;
    url: string;
    headers: HttpHeader[];
    body?: Uint8Array | null;
  }
  export interface HttpResponse {
    status: number;
    headers: HttpHeader[];
    body?: Uint8Array | null;
  }
  export type HttpError =
    | "invalid-url"
    | "not-allowed"
    | "transport"
    | "internal";
  export function fetch(request: HttpRequest): HttpResponse; // throws HttpError on failure
}

declare module "alga:extension/storage" {
  export interface StorageEntry {
    namespace: string;
    key: string;
    value: Uint8Array;
    revision?: number | null;
  }
  export type StorageError = "missing" | "conflict" | "denied" | "internal";
  export function get(namespace: string, key: string): StorageEntry; // throws StorageError
  export function put(entry: StorageEntry): StorageEntry;
  export function deleteEntry(namespace: string, key: string): void;
  export function listEntries(
    namespace: string,
    cursor?: string | null
  ): StorageEntry[];
}

declare module "alga:extension/context" {
  export interface ContextData {
    requestId?: string | null;
    tenantId: string;
    extensionId: string;
    installId?: string | null;
    versionId?: string | null;
  }
  export function getContext(): ContextData;
}

declare module "alga:extension/ui-proxy" {
  export type ProxyError =
    | "route-not-found"
    | "denied"
    | "bad-request"
    | "internal";
  export function callRoute(
    route: string,
    payload?: Uint8Array | null
  ): Uint8Array; // throws ProxyError
}

declare module "alga:extension/user" {
  export interface UserData {
    tenantId: string;
    clientName: string;
    userId: string;
    userEmail: string;
    userName: string;
    userType: string;
  }
  export type UserError = "not-available" | "not-allowed";
  export function getUser(): UserData; // throws UserError on failure
}
