import { Router } from "express";
import authController from "@controllers/auth.controller";
import bookController from "@controllers/book.controller";
import userController from "@controllers/user.controller";

const appControllers = [authController, userController, bookController];
const api = Router().use(...appControllers);

export default Router().use("/v1", api);
