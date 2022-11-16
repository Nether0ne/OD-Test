import HttpException from "@models/misc/http-exception.model";
import { getUserFromRequest } from "@services/auth.service";
import { UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getUser } from "@services/user.service";

export const user = {
  isActive: async (req: Request, _res: Response, next: NextFunction) => {
    const currentUser = getUserFromRequest(req);
    const id = Number(currentUser.id);

    try {
      const user = await getUser(id);

      if (user && user.status !== UserStatus.ACTIVE) {
        const { username, status } = user;
        next(new HttpException(401, `User ${username} is ${status}`));
      }
    } catch (e: unknown) {
      next(e);
    }
    next();
  },
  selfAction: async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = getUserFromRequest(req);
    const queryUserId = Number(req.params.id);

    if (id !== queryUserId) {
      next(new HttpException(401, "Unauthorized"));
    }
    next();
  },
  validId: (req: Request, _res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      next(new HttpException(422, "ID_IS_INVALID"));
    }
    next();
  },
};
