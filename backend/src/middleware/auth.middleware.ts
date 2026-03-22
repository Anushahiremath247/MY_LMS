import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

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

export const requireRole =
  (...roles: Array<"student" | "admin">) =>
  async (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user?.sub) {
      return next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { role: true }
    });

    if (!user || !roles.includes(user.role)) {
      return next(new AppError("You do not have permission to access this resource", StatusCodes.FORBIDDEN));
    }

    next();
  };
