import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { compareValue, hashValue } from "../../utils/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type UserJwtPayload
} from "../../utils/jwt.js";

const sanitizeUser = <T extends { passwordHash: string }>(user: T) => {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

const buildTokens = async (payload: UserJwtPayload) => {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const tokenHash = await hashValue(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: payload.sub,
      tokenHash,
      expiresAt: new Date(Date.now() + env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000)
    }
  });

  return { accessToken, refreshToken };
};

export const registerUser = async (input: { name: string; email: string; password: string }) => {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }

  const passwordHash = await hashValue(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(input.name)}`
    }
  });

  const payload = { sub: user.id, email: user.email, name: user.name };
  const tokens = await buildTokens(payload);

  return { user: sanitizeUser(user), ...tokens };
};

export const loginUser = async (input: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  const isPasswordValid = await compareValue(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  const payload = { sub: user.id, email: user.email, name: user.name };
  const tokens = await buildTokens(payload);

  return { user: sanitizeUser(user), ...tokens };
};

export const rotateRefreshToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const storedTokens = await prisma.refreshToken.findMany({
    where: {
      userId: user.id,
      revokedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  const matchingToken = await Promise.any(
    storedTokens.map(async (record) => {
      const matches = await compareValue(refreshToken, record.tokenHash);
      if (matches) {
        return record;
      }
      throw new Error("No match");
    })
  ).catch(() => null);

  if (!matchingToken) {
    throw new AppError("Refresh token not recognized", StatusCodes.UNAUTHORIZED);
  }

  await prisma.refreshToken.update({
    where: { id: matchingToken.id },
    data: { revokedAt: new Date() }
  });

  return buildTokens({ sub: user.id, email: user.email, name: user.name });
};

export const logoutUser = async (refreshToken?: string) => {
  if (!refreshToken) {
    return;
  }

  const tokens = await prisma.refreshToken.findMany({
    where: { revokedAt: null, expiresAt: { gt: new Date() } }
  });

  for (const token of tokens) {
    const matches = await compareValue(refreshToken, token.tokenHash);
    if (matches) {
      await prisma.refreshToken.update({
        where: { id: token.id },
        data: { revokedAt: new Date() }
      });
      break;
    }
  }
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          subject: true
        }
      },
      progress: true
    }
  });

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  return sanitizeUser(user);
};
