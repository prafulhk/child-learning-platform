import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { config } from "../config/index.js";
import { sendError } from "../shared/http/api-response.js";
import type { UserRole } from "../modules/auth/models/user.model.js";

export interface AuthTokenPayload extends JwtPayload {
  sub: string;
  role: UserRole;
}

export interface AuthContext {
  userId: string;
  role: UserRole;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    sendError({
      res,
      statusCode: 401,
      message: "Authentication required",
      code: "AUTHENTICATION_REQUIRED",
    });

    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthTokenPayload;

    if (!decoded.sub || !decoded.role) {
      sendError({
        res,
        statusCode: 401,
        message: "Invalid authentication token",
        code: "INVALID_AUTH_TOKEN",
      });

      return;
    }

    res.locals.auth = {
      userId: decoded.sub,
      role: decoded.role,
    } satisfies AuthContext;

    next();
  } catch {
    sendError({
      res,
      statusCode: 401,
      message: "Invalid or expired token",
      code: "INVALID_AUTH_TOKEN",
    });
  }
};
