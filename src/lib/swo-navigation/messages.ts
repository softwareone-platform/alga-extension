export type NavigationArgs = [
  data: any,
  unused: string,
  url?: string | URL | null | undefined
];

export type ReplaceNavigationMessage = {
  type: "swo:navigation:replace";
  args: NavigationArgs;
};

export type PushNavigationMessage = {
  type: "swo:navigation:push";
  args: NavigationArgs;
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
