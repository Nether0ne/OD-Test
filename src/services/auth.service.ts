import bcrypt from "bcryptjs";
import HttpException from "@models/misc/http-exception.model";
import prisma from "@/prisma/prisma-instance";
import { generateToken, getUserPayload } from "@utils/token.utils";
import { Request } from "express";
import ILoginInput from "@models/auth/login-input.model";
import IUserPayload from "@models/auth/user-payload.model";
import { excludeFromUser } from "@utils/user.utils";

export const login = async (input: ILoginInput) => {
  const email = input.email.trim();
  const password = input.password.trim();

  if (!email) {
    throw new HttpException(422, "EMAIL_REQUIRED");
  }

  if (!password) {
    throw new HttpException(422, "PASSWORD_REQUIRED");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (passwordMatches) {
      const userPayload: IUserPayload = { id: user.id };
      return {
        ...excludeFromUser(user, ["password"]),
        token: generateToken(userPayload),
      };
    }
  }

  throw new HttpException(403, "INVALID_CREDENTIALS");
};

export const getUserFromRequest = (req: Request): IUserPayload => {
  return getUserPayload(req);
};
