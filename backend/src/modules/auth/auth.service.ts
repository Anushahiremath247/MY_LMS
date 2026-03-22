import crypto from "node:crypto";
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

const buildUsername = (name: string, email: string) => {
  const baseName =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/(^\.|\.$)/g, "") ||
    email.split("@")[0] ||
    "learner";

  return `${baseName}.${Math.floor(Math.random() * 900 + 100)}`;
};

const logActivity = async (userId: string, action: string, description: string) => {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      description
    }
  });
};

const ensureUserDefaults = async (user: {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}) => {
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      imageUrl: user.avatar ?? undefined
    },
    create: {
      userId: user.id,
      username: buildUsername(user.name, user.email),
      bio: "Building momentum through focused, structured learning.",
      skills: "Learning Systems,Product Thinking,Self-paced Growth",
      imageUrl: user.avatar ?? undefined
    }
  });

  await prisma.privacySetting.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id
    }
  });

  await prisma.notificationSetting.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id
    }
  });
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
      avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(input.name)}`,
      lastLoginAt: new Date()
    }
  });

  await ensureUserDefaults(user);
  await logActivity(user.id, "auth.register", "Created a new Lazy Learning account");

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

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date()
    }
  });
  await ensureUserDefaults(user);
  await logActivity(user.id, "auth.login", "Signed in successfully");

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

export const logoutAllSessions = async (userId: string) => {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  });

  await logActivity(userId, "auth.logout_all", "Logged out from all devices");
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: "If the account exists, a reset link has been generated." };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = await hashValue(resetToken);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30)
    }
  });

  await logActivity(user.id, "auth.password_reset_requested", "Requested a password reset");

  return {
    message: "Password reset link generated successfully.",
    resetLink:
      env.NODE_ENV === "production"
        ? undefined
        : `${env.CLIENT_URL}/forgot-password?token=${resetToken}`
  };
};

export const resetPassword = async (input: { token: string; password: string }) => {
  const resetTokens = await prisma.passwordResetToken.findMany({
    where: {
      usedAt: null,
      expiresAt: { gt: new Date() }
    },
    include: {
      user: true
    }
  });

  const matchingToken = await Promise.any(
    resetTokens.map(async (record) => {
      const matches = await compareValue(input.token, record.tokenHash);
      if (matches) {
        return record;
      }

      throw new Error("No match");
    })
  ).catch(() => null);

  if (!matchingToken) {
    throw new AppError("Reset token is invalid or has expired", StatusCodes.UNAUTHORIZED);
  }

  await prisma.user.update({
    where: { id: matchingToken.userId },
    data: {
      passwordHash: await hashValue(input.password)
    }
  });

  await prisma.passwordResetToken.update({
    where: { id: matchingToken.id },
    data: { usedAt: new Date() }
  });

  await prisma.refreshToken.updateMany({
    where: {
      userId: matchingToken.userId,
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  });

  await logActivity(matchingToken.userId, "auth.password_reset_completed", "Reset account password");
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
      progress: true,
      profile: true,
      privacy: true,
      notifications: true
    }
  });

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  return sanitizeUser(user);
};
