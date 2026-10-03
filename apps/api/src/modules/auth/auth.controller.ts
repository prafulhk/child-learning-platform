import type { Request, Response } from "express";

import { RegisterSchema } from "./schemas/register.schema.js";
import { loginSchema } from "./schemas/login.schema.js";
import { registerParent, loginUser, getUserById } from "./auth.service.js";
import { z } from "zod";
import { sendError, sendSuccess } from "../../shared/http/api-response.js";

export async function registerController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;

    sendError({
      res,
      statusCode: 400,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: errors,
      legacy: {
        errors,
      },
    });

    return;
  }

  try {
    const user = await registerParent(parsed.data);

    sendSuccess({
      res,
      statusCode: 201,
      message: "Parent account created successfully",
      data: {
        user,
      },
      legacy: {
        user,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "An account with this email already exists"
    ) {
      sendError({
        res,
        statusCode: 409,
        message: error.message,
        code: "EMAIL_ALREADY_EXISTS",
      });

      return;
    }

    console.error("Registration error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to create account",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function loginController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;

    sendError({
      res,
      statusCode: 400,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: errors,
      legacy: {
        errors,
      },
    });

    return;
  }

  try {
    const result = await loginUser(parsed.data);

    sendSuccess({
      res,
      statusCode: 200,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
      legacy: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      sendError({
        res,
        statusCode: 401,
        message: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      });

      return;
    }

    console.error("Login error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to login",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function meController(req: Request, res: Response): Promise<void> {
  try {
    const user = await getUserById(res.locals.auth.userId);

    sendSuccess({
      res,
      statusCode: 200,
      data: {
        user,
      },
      legacy: {
        user,
      },
    });
  } catch {
    sendError({
      res,
      statusCode: 404,
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  }
}
