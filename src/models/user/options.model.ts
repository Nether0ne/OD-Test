import { UserStatus } from "@prisma/client";

export default interface IUserOptions {
  sort?: { [key: string]: number };
  limit?: number;
  page?: number;
  skip?: number;
}
