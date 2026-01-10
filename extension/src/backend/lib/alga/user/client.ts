import { User } from "@/shared/user";
import { getUser } from "alga:extension/user";

export class UsersClient {
  constructor() {}

  getUser(): User {
    return getUser() as User;
  }
}
