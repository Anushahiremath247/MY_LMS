import type { UserJwtPayload } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}

export {};

