import {
  isNavigationMessage,
  isPushNavigationMessage,
  isReplaceNavigationMessage,
  ReplaceNavigationMessage,
} from "./messages";

export const runHost = (hostWindow: Window, iframeWindow: Window) => {
  console.log("running host");
  const listener = (event: MessageEvent) => {
    console.log("message received in host", event);

    if (!isNavigationMessage(event.data)) return;

    const { args } = event.data;

    if (isReplaceNavigationMessage(event.data))
      hostWindow.history.replaceState(...args);

    if (isPushNavigationMessage(event.data))
      hostWindow.history.pushState(...args);

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
