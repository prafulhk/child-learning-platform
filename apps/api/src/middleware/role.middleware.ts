import type { RequestHandler } from "express";

import type { UserRole } from "../modules/auth/models/user.model.js";
import { sendError } from "../shared/http/api-response.js";
import type { AuthContext } from "./auth.middleware.js";

export function requireRoles(...allowedRoles: UserRole[]): RequestHandler {
  return (_req, res, next) => {
    const auth = res.locals.auth as AuthContext | undefined;

    if (!auth) {
      sendError({
        res,
        statusCode: 401,
        message: "Authentication required",
        code: "AUTHENTICATION_REQUIRED",
      });
      return;
    }

    if (!allowedRoles.includes(auth.role)) {
      sendError({
        res,
        statusCode: 403,
        message: "You do not have permission to access this resource",
        code: "FORBIDDEN",
      });
      return;
    }

    next();
  };
}

export const adminOnly = requireRoles("ADMIN");
