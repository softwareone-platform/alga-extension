import { isUrlChangedMessage } from "./messages";
import { toRelativeUrl } from "./utils";

export const runHost = (hostWindow: Window, iframeWindow: Window) => {
  const basePath = toRelativeUrl(hostWindow.location.href);
  console.log("running host", basePath);

  const handleMessage = (event: MessageEvent) => {
    if (!isUrlChangedMessage(event.data)) return;
    const { relativeUrl } = event.data;

    console.log("message received in host", relativeUrl);

    hostWindow.history.replaceState(null, "", `${basePath}${relativeUrl}`);
  };

  hostWindow.addEventListener("message", handleMessage);

  return () => {
    hostWindow.removeEventListener("message", handleMessage);
    console.log("host teardown");
  };
};
