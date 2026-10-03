import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { config } from "../config/index.js";
import { sendError } from "../shared/http/api-response.js";

interface AuthTokenPayload extends JwtPayload {
  sub: string;
  role: "PARENT" | "TEACHER";
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

    res.locals.auth = {
      userId: decoded.sub,
      role: decoded.role,
    };

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
