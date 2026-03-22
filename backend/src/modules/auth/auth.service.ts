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

export type OAuthProvider = "google" | "github";

const sanitizeUser = <T extends { passwordHash: string }>(user: T) => {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

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

const createAuthSessionForUser = async (user: {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  passwordHash: string;
  role: "student" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  deactivatedAt: Date | null;
}) => {
  const payload = { sub: user.id, email: user.email, name: user.name };
  const tokens = await buildTokens(payload);

  return { user: sanitizeUser(user), ...tokens };
};

const getOAuthCallbackUrl = (provider: OAuthProvider) =>
  `${env.SERVER_URL}/api/auth/oauth/${provider}/callback`;

const getOAuthConfig = (provider: OAuthProvider) => {
  if (provider === "google") {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      throw new AppError("Google login is not configured", StatusCodes.SERVICE_UNAVAILABLE);
    }

    return {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    };
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    throw new AppError("GitHub login is not configured", StatusCodes.SERVICE_UNAVAILABLE);
  }

  return {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET
  };
};

const findOrCreateOAuthUser = async (input: {
  provider: OAuthProvider;
  email: string;
  name: string;
  avatar?: string | null;
}) => {
  const email = normalizeEmail(input.email);
  const now = new Date();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    const passwordHash = await hashValue(crypto.randomUUID());
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email,
        passwordHash,
        avatar: input.avatar ?? `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(input.name)}`,
        lastLoginAt: now
      }
    });

    await ensureUserDefaults(user);
    await logActivity(user.id, `auth.${input.provider}_register`, `Created a new account with ${input.provider}`);

    return createAuthSessionForUser(user);
  }

  const user = await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      name: existingUser.name || input.name,
      avatar: existingUser.avatar ?? input.avatar ?? undefined,
      lastLoginAt: now
    }
  });

  await ensureUserDefaults(user);
  await logActivity(user.id, `auth.${input.provider}_login`, `Signed in with ${input.provider}`);

  return createAuthSessionForUser(user);
};

const getGoogleProfile = async (code: string) => {
  const config = getOAuthConfig("google");
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: getOAuthCallbackUrl("google"),
      grant_type: "authorization_code"
    })
  });

  const tokenPayload = (await tokenResponse.json().catch(() => null)) as { access_token?: string; error?: string } | null;

  if (!tokenResponse.ok || !tokenPayload?.access_token) {
    throw new AppError("Google login failed", StatusCodes.BAD_GATEWAY);
  }

  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`
    }
  });
  const profile = (await profileResponse.json().catch(() => null)) as {
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  } | null;

  if (!profileResponse.ok || !profile?.email) {
    throw new AppError("Google account details could not be loaded", StatusCodes.BAD_GATEWAY);
  }

  if (!profile.email_verified) {
    throw new AppError("Google account email is not verified", StatusCodes.BAD_REQUEST);
  }

  return {
    email: profile.email,
    name: profile.name?.trim() || profile.email.split("@")[0] || "Lazy Learning Student",
    avatar: profile.picture ?? null
  };
};

const getGithubProfile = async (code: string) => {
  const config = getOAuthConfig("github");
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: getOAuthCallbackUrl("github")
    })
  });
  const tokenPayload = (await tokenResponse.json().catch(() => null)) as { access_token?: string } | null;

  if (!tokenResponse.ok || !tokenPayload?.access_token) {
    throw new AppError("GitHub login failed", StatusCodes.BAD_GATEWAY);
  }

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${tokenPayload.access_token}`,
    "User-Agent": "lazy-learning-auth"
  };

  const [profileResponse, emailsResponse] = await Promise.all([
    fetch("https://api.github.com/user", { headers }),
    fetch("https://api.github.com/user/emails", { headers })
  ]);

  const profile = (await profileResponse.json().catch(() => null)) as {
    name?: string;
    login?: string;
    avatar_url?: string;
  } | null;
  const emails = (await emailsResponse.json().catch(() => null)) as
    | Array<{ email: string; primary: boolean; verified: boolean }>
    | null;

  const verifiedEmail =
    emails?.find((item) => item.primary && item.verified)?.email ??
    emails?.find((item) => item.verified)?.email ??
    null;

  if (!profileResponse.ok || !emailsResponse.ok || !verifiedEmail) {
    throw new AppError("GitHub account email could not be verified", StatusCodes.BAD_GATEWAY);
  }

  return {
    email: verifiedEmail,
    name: profile?.name?.trim() || profile?.login || verifiedEmail.split("@")[0] || "Lazy Learning Student",
    avatar: profile?.avatar_url ?? null
  };
};

export const registerUser = async (input: { name: string; email: string; password: string }) => {
  const email = normalizeEmail(input.email);
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }

  const passwordHash = await hashValue(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
      avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(input.name)}`,
      lastLoginAt: new Date()
    }
  });

  await ensureUserDefaults(user);
  await logActivity(user.id, "auth.register", "Created a new Lazy Learning account");

  return createAuthSessionForUser(user);
};

export const loginUser = async (input: { email: string; password: string }) => {
  const email = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({ where: { email } });

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

  return createAuthSessionForUser({
    ...user,
    lastLoginAt: new Date()
  });
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

  const tokens = await buildTokens({ sub: user.id, email: user.email, name: user.name });

  return { user: sanitizeUser(user), ...tokens };
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
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });

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

export const getOAuthAuthorizationUrl = (provider: OAuthProvider, state: string) => {
  const config = getOAuthConfig(provider);

  if (provider === "google") {
    const searchParams = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: getOAuthCallbackUrl("google"),
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account"
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${searchParams.toString()}`;
  }

  const searchParams = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: getOAuthCallbackUrl("github"),
    scope: "read:user user:email",
    state
  });

  return `https://github.com/login/oauth/authorize?${searchParams.toString()}`;
};

export const authenticateOAuthCode = async (provider: OAuthProvider, code: string) => {
  const profile = provider === "google" ? await getGoogleProfile(code) : await getGithubProfile(code);

  return findOrCreateOAuthUser({
    provider,
    ...profile
  });
};
