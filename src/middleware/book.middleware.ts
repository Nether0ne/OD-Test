import HttpException from "@models/misc/http-exception.model";
import { NextFunction, Request, Response } from "express";

export const book = {
  validId: (req: Request, _res: Response, next: NextFunction) => {
    const id = Number(req.params.id || req.body.book.id);

    if (isNaN(id)) {
      next(new HttpException(422, "ID_IS_INVALID"));
    }
    next();
  },
};
