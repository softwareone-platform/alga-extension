import {
  isNavigationMessage,
  isPushNavigationMessage,
  isReplaceNavigationMessage,
  ReplaceNavigationMessage,
} from "./messages";

export const runHost = (hostWindow: Window, iframeWindow: Window) => {
  console.log("attached");
  hostWindow.onmessage = (event) => {
    console.log("message received in host", event);

    if (!isNavigationMessage(event.data)) return;

    const { data, unused, url } = event.data.data;

    if (isReplaceNavigationMessage(event.data))
      hostWindow.history.replaceState(data, unused, url);

    if (isPushNavigationMessage(event.data))
      hostWindow.history.pushState(data, unused, url);

    iframeWindow.postMessage(
      {
        type: "swo:navigation:replace",
        data: { data, unused, url },
      } satisfies ReplaceNavigationMessage,
      "*"
    );
  };
};
