import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { config } from "../config/index.js";

interface AuthTokenPayload extends JwtPayload {
  sub: string;
  role: "PARENT" | "TEACHER";
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication required",
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
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
