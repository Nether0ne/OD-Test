import { auth } from "@middleware/auth.middleware";
import { user } from "@middleware/user.middleware";
import { NextFunction, Request, Response, Router } from "express";
import IHttpResponse from "@models/misc/http-response.model";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "@services/user.service";
import IUserOptions from "@models/user/options.model";
import IUserAddInput from "@models/user/add.model";
import IUserEditInput from "@models/user/edit.model";
import IUserQuery from "@models/user/query.model";

const router = Router();

/** Get a single user
 * @auth required
 * @user status is active
 * @user params are valid
 * @route {GET} /user/{id}
 * @param id string
 * @returns data User
 */
router.get(
  "/user/:id",
  [auth.required, user.validId, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const user = await getUser(userId);
      const resBody: IHttpResponse = { success: true, data: user };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Get users
 * @auth required
 * @user status is active
 * @route {GET} /users
 * @query query IUserQuery
 * @query options IUserOptions
 * @returns books Book[]
 */
router.get(
  "/users",
  [auth.required, user.isActive],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.query as IUserQuery;
      const options = req.query.options as IUserOptions;
      const users = await getUsers(query, options);
      const resBody: IHttpResponse = { success: true, data: users };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Create a new user
 * @route {POST} /user
 * @bodyParam user IUserInput
 * @returns user User
 */
router.post(
  "/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInput: IUserAddInput = req.body.user;
      const newUser = await createUser(userInput);
      const resBody: IHttpResponse = { success: true, data: newUser };
      res.status(201).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Update an existing user
 * @auth required
 * @user performs self action
 * @user status is active
 * @route {PATCH} /user
 * @param id string
 * @bodyParam user IUserEditInput
 * @returns user Partial<User>
 */
router.patch(
  "/user/:id",
  [auth.required, user.validId, user.isActive, user.selfAction],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const editInput = req.body.user as IUserEditInput;
      const updatedUser = await updateUser(userId, editInput);
      const resBody: IHttpResponse = { success: true, data: updatedUser };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Deletes an existing user
 * @auth required
 * @user status is active
 * @route {DELETE} /user
 * @param id number
 */
router.delete(
  "/user/:id",
  [auth.required, user.isActive, user.selfAction, user.validId],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      await deleteUser(userId);
      const resBody: IHttpResponse = { success: true };
      res.status(200).json(resBody);
    } catch (error: unknown) {
      next(error);
    }
  },
);

export default router;
