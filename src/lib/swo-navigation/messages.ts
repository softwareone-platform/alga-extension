export type NavigationMessageData = {
  data: any;
  unused: string;
  url?: string | URL | null;
};

export type ReplaceNavigationMessage = {
  type: "swo:navigation:replace";
  data: NavigationMessageData;
};

export type PushNavigationMessage = {
  type: "swo:navigation:push";
  data: NavigationMessageData;
};

export type NavigationMessage =
  | ReplaceNavigationMessage
  | PushNavigationMessage;

export const isReplaceNavigationMessage = (
  message: NavigationMessage
): message is ReplaceNavigationMessage => {
  return message.type === "swo:navigation:replace";
};

export const isPushNavigationMessage = (
  message: NavigationMessage
): message is PushNavigationMessage => {
  return message.type === "swo:navigation:push";
};

export const isNavigationMessage = (
  message: NavigationMessage
): message is NavigationMessage => {
  return (
    isReplaceNavigationMessage(message) || isPushNavigationMessage(message)
  );
};
