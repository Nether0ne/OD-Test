import bcrypt from "bcryptjs";
import IRegisterInput from "@models/auth/register-input.model";
import HttpException from "@models/misc/http-exception.model";
import { checkIfUserExists, excludeFromUser } from "@utils/user.utils";
import { Prisma, User } from "@prisma/client";
import IUserEditInput from "@models/user/edit.model";
import IUserOptions from "@models/user/options.model";
import prisma from "@/prisma/prisma-instance";
import IUserQuery from "@models/user/query.model";

export const getUser = async (id: number): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { favoriteBooks: true },
  });
  if (!user) {
    throw new HttpException(404, "USER_NOT_FOUND");
  }

  return excludeFromUser(user, ["password"]);
};

export const getUsers = async (
  query: IUserQuery,
  options: IUserOptions,
): Promise<Partial<User>[]> => {
  const { sort, limit: take, page, skip } = options;
  let currentSkip = skip;

  if (!currentSkip && page && take) {
    currentSkip = (page - 1) * take;
  }
  const where: Prisma.UserWhereInput = {
    username: query?.username ?? undefined,
    email: query?.email ?? undefined,
    status: query?.status ?? undefined,
    firstName: query?.firstName ?? undefined,
    lastName: query?.lastName ?? undefined,
  };
  const orderBy = sort
    ? Object.entries(sort).map(([key, val]) => ({
        [key]: val === -1 ? "desc" : "asc",
      }))
    : undefined;

  const users = await prisma.user.findMany({
    where,
    take,
    skip: currentSkip,
    orderBy,
    include: { favoriteBooks: true },
  });

  return users.map((u) => excludeFromUser(u, ["password"]));
};

export const createUser = async (
  input: IRegisterInput,
): Promise<Partial<User>> => {
  const email = input.email;
  const username = input.username;
  const password = input.password;
  const firstName = input.firstName;
  const lastName = input.lastName;

  if (!email) {
    throw new HttpException(422, "EMAIL_REQUIRED");
  }

  if (!username) {
    throw new HttpException(422, "USERNAME_REQUIRED");
  }

  if (!password) {
    throw new HttpException(422, "PASSWORD_REQUIRED");
  }

  if (!firstName) {
    throw new HttpException(422, "FIRSTNAME_REQUIRED");
  }

  if (!lastName) {
    throw new HttpException(422, "LASTNAME_REQUIRED");
  }

  await checkIfUserExists(email, username);
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });
  return excludeFromUser(newUser, ["password"]);
};

export const updateUser = async (
  id: number,
  editInput: IUserEditInput,
): Promise<Partial<User>> => {
  const select: Prisma.UserSelect = Object.entries(editInput).reduce(
    (o, [key, val]) => ({ ...o, [key]: val ? true : undefined }),
    {},
  );

  return await prisma.user.update({
    where: { id },
    data: editInput,
    select,
  });
};

export const deleteUser = async (id: number) => {
  if (id < 0) {
    throw new HttpException(422, "ID_IS_INVALID");
  }

  const foundUser = await prisma.user.findUnique({ where: { id } });
  if (!foundUser) {
    throw new HttpException(404, "USER_NOT_FOUND");
  }

  await prisma.user.delete({ where: { id } });
};
