import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

export const errorMiddleware = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      message: "Validation error",
      issues: error.flatten()
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return response.status(StatusCodes.BAD_REQUEST).json({
      message: "Database error",
      code: error.code
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error"
  });
};

