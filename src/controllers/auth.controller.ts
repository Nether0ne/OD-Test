import { NextFunction, Request, Response, Router } from "express";
import { getUserFromRequest, login } from "@services/auth.service";
import { auth } from "@middleware/auth.middleware";
import { getUser } from "@services/user.service";
import { user } from "@middleware/user.middleware";
import IHttpResponse from "@models/misc/http-response.model";
import ILoginInput from "@models/auth/login-input.model";

const router = Router();

/**
 * Gets current user
 * @auth required
 * @user status is active
 * @route {GET} /currentUser
 * @returns user User
 */
router.get(
  "/currentUser",
  [auth.required, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = getUserFromRequest(req);
      const user = await getUser(id);
      const resBody: IHttpResponse = { success: true, data: user };
      res.json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Logins a user
 * @route {POST} /user/login
 * @bodyParam loginInput ILoginInput
 * @returns user User
 */
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginInput = req.body.user as ILoginInput;
      const user = await login(loginInput);
      const resBody: IHttpResponse = { success: true, data: user };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

export default router;
