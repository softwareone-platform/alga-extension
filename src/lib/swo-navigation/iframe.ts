import { isUrlChangedMessage, UrlChangedMessage } from "./messages";
import { toRelativeUrl } from "./utils";

export const runIFrame = (hostWindow: Window, iframeWindow: Window) => {
  console.log("running iframe");
  const orginalReplaceState = iframeWindow.history.replaceState.bind(
    iframeWindow.history
  );

  const orginalPushState = iframeWindow.history.pushState.bind(
    iframeWindow.history
  );

  const handleMessage = (event: MessageEvent) => {
    if (isUrlChangedMessage(event.data)) {
      const { relativeUrl } = event.data;
      console.log("message received in iframe", relativeUrl);
    }
  };
  iframeWindow.addEventListener("message", handleMessage);

  const handlePopState = () => {
    console.log(
      "popstate received in iframe",
      toRelativeUrl(iframeWindow.location.href)
    );
    hostWindow.postMessage(
      {
        type: "swo:url-changed",
        relativeUrl: toRelativeUrl(iframeWindow.location.href),
      } satisfies UrlChangedMessage,
      "*"
    );
  };

  iframeWindow.addEventListener("popstate", handlePopState);

  iframeWindow.history.replaceState = (...args) => {
    hostWindow.postMessage(
      {
        type: "swo:url-changed",
        relativeUrl: toRelativeUrl(args[2]!),
      } satisfies UrlChangedMessage,
      "*"
    );
    orginalReplaceState(...args);
  };

  iframeWindow.history.pushState = (...args) => {
    hostWindow.postMessage(
      {
        type: "swo:url-changed",
        relativeUrl: toRelativeUrl(args[2]!),
      } satisfies UrlChangedMessage,
      "*"
    );
    orginalPushState(...args);
  };

  return () => {
    iframeWindow.removeEventListener("message", handleMessage);
    iframeWindow.removeEventListener("popstate", handlePopState);
    iframeWindow.history.replaceState = orginalReplaceState;
    iframeWindow.history.pushState = orginalPushState;
    console.log("iframe teardown");
  };
};
