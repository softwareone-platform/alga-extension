export const toAbsoluteUrl = (url: string | URL) => {
  if (url instanceof URL) {
    return url.toString();
  }

  const isRelative = url.startsWith("/");
  return isRelative ? `${window.location.origin}${url}` : url;
};
