import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type UserJwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export const signAccessToken = (payload: UserJwtPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  });

export const signRefreshToken = (payload: UserJwtPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.JWT_REFRESH_EXPIRES_DAYS}d` as SignOptions["expiresIn"]
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as UserJwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as UserJwtPayload;
