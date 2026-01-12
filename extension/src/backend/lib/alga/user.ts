import { User } from "@/shared/user";
import { getUser as getUserData } from "alga:extension/user";

export const getUser = (): User => {
  return getUserData() as User;
};
