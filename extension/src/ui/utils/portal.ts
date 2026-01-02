export type Portal = "msp" | "client";

export const PORTAL: Portal = window.location.pathname.startsWith("/msp")
  ? "msp"
  : "client";
