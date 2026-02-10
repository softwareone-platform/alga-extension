import { route } from "@/backend/routing";

route("GET", "/user", ({ user }) => {
  return { status: 200, body: user };
});
