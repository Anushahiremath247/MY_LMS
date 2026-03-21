import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  rotateRefreshToken
} from "./auth.service.js";

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge: env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000
};

export const register = asyncHandler(async (request: Request, response: Response) => {
  const result = await registerUser(request.body);
  response.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
  response.status(StatusCodes.CREATED).json({
    accessToken: result.accessToken,
    user: result.user
  });
});

export const login = asyncHandler(async (request: Request, response: Response) => {
  const result = await loginUser(request.body);
  response.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
  response.status(StatusCodes.OK).json({
    accessToken: result.accessToken,
    user: result.user
  });
});

export const refresh = asyncHandler(async (request: Request, response: Response) => {
  const refreshToken = request.cookies.refreshToken;
  const result = await rotateRefreshToken(refreshToken);
  response.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
  response.status(StatusCodes.OK).json(result);
});

export const logout = asyncHandler(async (request: Request, response: Response) => {
  await logoutUser(request.cookies.refreshToken);
  response.clearCookie("refreshToken");
  response.status(StatusCodes.OK).json({ message: "Logged out successfully" });
});

export const me = asyncHandler(async (request: Request, response: Response) => {
  const user = await getCurrentUser(request.user!.sub);
  response.status(StatusCodes.OK).json(user);
});

