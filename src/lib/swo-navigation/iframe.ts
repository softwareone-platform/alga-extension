import {
  isReplaceNavigationMessage,
  PushNavigationMessage,
  ReplaceNavigationMessage,
} from "./messages";

export const runIFrame = (hostWindow: Window, iframeWindow: Window) => {
  if (hostWindow === iframeWindow) {
    console.log("Not in iFrame. Skipping...");
    return;
  }

  const orginalReplaceState = iframeWindow.history.replaceState.bind(
    iframeWindow.history
  );

  iframeWindow.addEventListener("message", (event) => {
    console.log("message received in iframe", event.data);
    if (isReplaceNavigationMessage(event.data)) {
      const { data, unused, url } = event.data.data;
      orginalReplaceState(data, unused, url);
    }
  });

  iframeWindow.history.replaceState = (...args) =>
    hostWindow.postMessage(
      {
        type: "swo:navigation:replace",
        data: { data: args[0], unused: args[1], url: args[2] },
      } satisfies ReplaceNavigationMessage,
      "*"
    );

  iframeWindow.history.pushState = (...args) =>
    hostWindow.postMessage(
      {
        type: "swo:navigation:push",
        data: { data: args[0], unused: args[1], url: args[2] },
      } satisfies PushNavigationMessage,
      "*"
    );
};
