import { UserStatus } from "@prisma/client";

export default interface IUserQuery {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
}
