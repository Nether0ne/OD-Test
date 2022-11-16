import { getTokenFromHeaders } from "@utils/auth.utils";
import { expressjwt } from "express-jwt";

export const auth = {
  required: expressjwt({
    secret: process.env.JWT_SECRET || "superSecret",
    getToken: getTokenFromHeaders,
    algorithms: ["HS256"],
  }),
  optional: expressjwt({
    secret: process.env.JWT_SECRET || "superSecret",
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    algorithms: ["HS256"],
  }),
};
