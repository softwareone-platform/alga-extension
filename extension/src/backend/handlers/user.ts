import { defineHandler } from "../engine";

defineHandler("GET", "/user", ({ user }) => {
  return { status: 200, body: user };
});
