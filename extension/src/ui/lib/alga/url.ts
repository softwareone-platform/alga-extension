import axios from "axios";

function resolveHostOrigin() {
  const referrer = document.referrer;
  if (referrer) {
    try {
      return new URL(referrer).origin;
    } catch {
      // ignore invalid referrer
    }
  }

  try {
    if (window.parent && window.parent !== window && window.parent.location) {
      return window.parent.location.origin;
    }
  } catch {
    // cross-origin access throws
  }

  return window.location.origin;
}

function resolveExtensionId(searchParams: URLSearchParams) {
  const fromQuery = searchParams.get("extensionId");
  if (fromQuery && fromQuery !== "unknown") {
    return fromQuery;
  }

  const segments = window.location.pathname.split("/").filter(Boolean);
  const extUiIndex = segments.indexOf("ext-ui");
  if (extUiIndex >= 0 && segments[extUiIndex + 1]) {
    try {
      return decodeURIComponent(segments[extUiIndex + 1]);
    } catch {
      return segments[extUiIndex + 1];
    }
  }
  return null;
}

const EXT_ID = resolveExtensionId(new URLSearchParams(window.location.search));

const hostOrigin = resolveHostOrigin();

export const backendClient = axios.create({
  baseURL: new URL(`/api/ext/${EXT_ID}`, hostOrigin).toString(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
