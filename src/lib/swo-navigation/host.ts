import {
  isNavigationMessage,
  isPushNavigationMessage,
  isReplaceNavigationMessage,
  ReplaceNavigationMessage,
} from "./messages";

export const runHost = (hostWindow: Window, iframeWindow: Window) => {
  console.log("running host");
  const listener = (event: MessageEvent) => {
    if (!isNavigationMessage(event.data)) return;

    console.log("message received in host", event.data);
    const { args } = event.data;

    if (isReplaceNavigationMessage(event.data))
      hostWindow.history.replaceState(...args);

    if (isPushNavigationMessage(event.data))
      hostWindow.history.replaceState(...args);

    iframeWindow.postMessage(
      {
        type: "swo:navigation:replace",
        args,
      } satisfies ReplaceNavigationMessage,
      "*"
    );
  };

  hostWindow.addEventListener("message", listener);

  return () => {
    hostWindow.removeEventListener("message", listener);
    console.log("host teardown");
  };
};
