import { Request } from "express";
import jwt from "jsonwebtoken";
import { getTokenFromHeaders } from "@utils/auth.utils";
import IUserPayload from "@models/auth/user-payload.model";

export const generateToken = (userPayload: IUserPayload): string =>
  jwt.sign(userPayload, process.env.JWT_SECRET || "superSecret", {
    expiresIn: "300m",
  });

export const getUserPayload = (headers: Request): IUserPayload => {
  const token = getTokenFromHeaders(headers) as string;
  return jwt.verify(
    token,
    process.env.JWT_SECRET || "superSecret",
  ) as IUserPayload;
};
