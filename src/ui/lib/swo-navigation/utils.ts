export const toAbsoluteUrl = (url: string | URL) => {
  if (url instanceof URL) return url.toString();

  const isRelative = url.startsWith("/");
  return isRelative ? `${window.location.origin}${url}` : url;
};

export const toRelativeUrl = (url: string | URL) => {
  if (!(url instanceof URL) && url.startsWith("/")) return url;

  const urlObj = new URL(url);

  return urlObj.href.replace(urlObj.origin, "") || "/";
};
