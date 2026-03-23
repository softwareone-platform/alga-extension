export type UrlChangedMessage = {
  type: "swo:url-changed";
  relativeUrl: string;
};

export const isUrlChangedMessage = (
  message: any
): message is UrlChangedMessage => {
  return message.type === "swo:url-changed";
};
