import { Request } from "express";
import { TokenGetter } from "express-jwt";

export const getTokenFromHeaders: TokenGetter = (
  req: Request,
): string | Promise<string> | undefined => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return undefined;
};
