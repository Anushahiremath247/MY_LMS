import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = (request: Request, _response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    return next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
  }

  try {
    request.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError("Invalid or expired access token", StatusCodes.UNAUTHORIZED));
  }
};

