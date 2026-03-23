//Model
export type UserType = "internal" | "client";
export type User = {
  tenantId: string;
  clientName: string;
  userId: string;
  userEmail: string;
  userName: string;
  userType: "internal" | "client";
};

//API
export type UserResponseBody = User;
