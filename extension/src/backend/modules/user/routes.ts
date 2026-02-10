import { defineHandler } from "@/backend/engine";

defineHandler("GET", "/user", ({ user }) => {
  return { status: 200, body: user };
});
