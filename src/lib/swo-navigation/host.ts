import { isUrlChangedMessage } from "./messages";

export const runHost = (
  hostWindow: Window,
  setUrl: (relativeUrl: string) => void
) => {
  console.log("running host");

  const handleMessage = (event: MessageEvent) => {
    if (!isUrlChangedMessage(event.data)) return;
    const { relativeUrl } = event.data;

    setUrl(relativeUrl);
  };

  hostWindow.addEventListener("message", handleMessage);

  return () => {
    hostWindow.removeEventListener("message", handleMessage);
    console.log("host teardown");
  };
};
