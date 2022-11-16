import HttpException from "@/models/misc/http-exception.model";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error | HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let errorMessage = err.message;
  let status = 500;
  if (err instanceof HttpException) {
    status = err.errorCode;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P1000": {
        errorMessage = "INVALID_DB_CREDENTIALS";
        break;
      }
      case "P1001": {
        errorMessage = "UNREACHABLE_DB";
        break;
      }
      case "P1002": {
        errorMessage = "REACHED_BUT_TIMEOUT";
        break;
      }
      case "P1003": {
        errorMessage = "DATABASE_DOES_NOT_EXIST";
        break;
      }
      case "P2002": {
        errorMessage = "UNIQUE_CONSTRAINT_FAILED";
        break;
      }
    }
  }

  res.status(status).json({
    success: false,
    message: errorMessage || "Internal server error",
  });
};

export default errorHandler;
