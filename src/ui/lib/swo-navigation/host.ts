import { isUrlChangedMessage } from "./messages";

export const runHost = (
  hostWindow: Window,
  replaceUrl: (relativeUrl: string) => void
) => {
  const handleMessage = (event: MessageEvent) => {
    if (isUrlChangedMessage(event.data)) replaceUrl(event.data.relativeUrl);
  };

  hostWindow.addEventListener("message", handleMessage);

  return () => {
    hostWindow.removeEventListener("message", handleMessage);
  };
};
