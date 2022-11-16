import HttpException from "@models/misc/http-exception.model";
import prisma from "@/prisma/prisma-instance";

export const checkIfUserExists = async (email: string, username: string) => {
  const userWithEmail = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  const userWithUsername = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (userWithEmail || userWithUsername) {
    throw new HttpException(422, `USER_ALREADY_EXISTS`);
  }
};

export const excludeFromUser = <User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> => {
  for (const key of keys) {
    delete user[key];
  }
  return user;
};
