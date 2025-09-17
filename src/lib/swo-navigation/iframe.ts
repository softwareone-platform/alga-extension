import {
  NavigationArgs,
  isReplaceNavigationMessage,
  PushNavigationMessage,
  ReplaceNavigationMessage,
} from "./messages";
import { toAbsoluteUrl } from "./utils";

export const runIFrame = (
  hostWindow: Window,
  iframeWindow: Window,
  replaceStateFn?: (...args: NavigationArgs) => void
) => {
  console.log("running iframe");
  const orginalReplaceState = iframeWindow.history.replaceState.bind(
    iframeWindow.history
  );

  const orginalPushState = iframeWindow.history.pushState.bind(
    iframeWindow.history
  );

  const listener = (event: MessageEvent) => {
    if (isReplaceNavigationMessage(event.data)) {
      console.log("message received in iframe", event.data);
      const { args } = event.data;

      if (args[2] && toAbsoluteUrl(args[2]) === iframeWindow.location.href)
        return;

      console.log("replacing state in iframe", args);
      replaceStateFn?.(...args) || orginalReplaceState(...args);
    }
  };

  iframeWindow.addEventListener("message", listener);

  iframeWindow.history.replaceState = (...args) => {
    hostWindow.postMessage(
      {
        type: "swo:navigation:replace",
        args,
      } satisfies ReplaceNavigationMessage,
      "*"
    );
    orginalReplaceState(...args);
  };

  iframeWindow.history.pushState = (...args) => {
    hostWindow.postMessage(
      {
        type: "swo:navigation:push",
        args,
      } satisfies PushNavigationMessage,
      "*"
    );
    orginalReplaceState(...args);
  };

  return () => {
    iframeWindow.removeEventListener("message", listener);
    iframeWindow.history.replaceState = orginalReplaceState;
    iframeWindow.history.pushState = orginalPushState;
    console.log("iframe teardown");
  };
};
