import crypto from "node:crypto";
import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/request.js";
import {
  authenticateOAuthCode,
  getOAuthAuthorizationUrl,
  getCurrentUser,
  loginUser,
  logoutUser,
  logoutAllSessions,
  type OAuthProvider,
  requestPasswordReset,
  registerUser,
  resetPassword,
  rotateRefreshToken
} from "./auth.service.js";

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  secure: env.NODE_ENV === "production",
  maxAge: env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000
};

const oauthStateCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge: 10 * 60 * 1000
};

const isOAuthProvider = (value: string): value is OAuthProvider => value === "google" || value === "github";

const getOAuthStateCookieName = (provider: OAuthProvider) => `oauth_state_${provider}`;
const REDIRECT_STATUS = 302;

const normalizeRedirectPath = (value: string) =>
  value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";

const buildLoginErrorRedirect = (error: string, redirectTo: string) =>
  `${env.CLIENT_URL}/login?error=${encodeURIComponent(error)}&next=${encodeURIComponent(redirectTo)}`;

const buildOauthSuccessRedirect = (
  payload: { accessToken: string; user: { id: string; name: string; email: string; avatar?: string | null; role?: string } },
  redirectTo: string
) => {
  const hash = new URLSearchParams({
    accessToken: payload.accessToken,
    user: JSON.stringify(payload.user),
    redirectTo
  });

  return `${env.CLIENT_URL}/auth/callback#${hash.toString()}`;
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
  response.clearCookie("refreshToken", refreshCookieOptions);
  response.status(StatusCodes.OK).json({ message: "Logged out successfully" });
});

export const logoutAll = asyncHandler(async (request: Request, response: Response) => {
  await logoutAllSessions(request.user!.sub);
  response.clearCookie("refreshToken", refreshCookieOptions);
  response.status(StatusCodes.OK).json({ message: "Logged out from all devices successfully" });
});

export const me = asyncHandler(async (request: Request, response: Response) => {
  const user = await getCurrentUser(request.user!.sub);
  response.status(StatusCodes.OK).json(user);
});

export const forgotPassword = asyncHandler(async (request: Request, response: Response) => {
  const result = await requestPasswordReset(request.body.email);
  response.status(StatusCodes.OK).json(result);
});

export const resetPasswordController = asyncHandler(async (request: Request, response: Response) => {
  await resetPassword(request.body);
  response.status(StatusCodes.OK).json({ message: "Password reset successfully" });
});

export const oauthStart = asyncHandler(async (request: Request, response: Response) => {
  const provider = getParam(request.params.provider);

  if (!isOAuthProvider(provider)) {
    return response.redirect(REDIRECT_STATUS, buildLoginErrorRedirect("oauth_provider_invalid", "/dashboard"));
  }

  const redirectTo = normalizeRedirectPath(
    getParam(request.query.redirectTo as string | string[] | undefined) || "/dashboard"
  );
  const state = crypto.randomBytes(24).toString("hex");
  let authorizationUrl = "";

  try {
    authorizationUrl = getOAuthAuthorizationUrl(provider, state);
  } catch {
    return response.redirect(
      REDIRECT_STATUS,
      buildLoginErrorRedirect(`oauth_${provider}_not_configured`, redirectTo)
    );
  }

  response.cookie(
    getOAuthStateCookieName(provider),
    JSON.stringify({ state, redirectTo }),
    oauthStateCookieOptions
  );
  response.redirect(REDIRECT_STATUS, authorizationUrl);
});

export const oauthCallback = asyncHandler(async (request: Request, response: Response) => {
  const provider = getParam(request.params.provider);

  if (!isOAuthProvider(provider)) {
    return response.redirect(REDIRECT_STATUS, buildLoginErrorRedirect("oauth_provider_invalid", "/dashboard"));
  }

  const code = getParam(request.query.code as string | string[] | undefined);
  const state = getParam(request.query.state as string | string[] | undefined);
  const cookieName = getOAuthStateCookieName(provider);
  const cookieValue = request.cookies[cookieName] as string | undefined;
  response.clearCookie(cookieName, oauthStateCookieOptions);

  let redirectTo = "/dashboard";

  try {
    const parsedCookie = cookieValue ? (JSON.parse(cookieValue) as { state?: string; redirectTo?: string }) : null;
    redirectTo = normalizeRedirectPath(parsedCookie?.redirectTo || redirectTo);

    if (!code || !state || !parsedCookie?.state || parsedCookie.state !== state) {
      return response.redirect(REDIRECT_STATUS, buildLoginErrorRedirect("oauth_state_invalid", redirectTo));
    }

    const result = await authenticateOAuthCode(provider, code);

    response.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
    response.redirect(
      REDIRECT_STATUS,
      buildOauthSuccessRedirect(
        {
          accessToken: result.accessToken,
          user: result.user
        },
        redirectTo
      )
    );
  } catch {
    response.redirect(REDIRECT_STATUS, buildLoginErrorRedirect(`oauth_${provider}_failed`, redirectTo));
  }
});
