import type { Request, Response } from "express";

import { RegisterSchema } from "./schemas/register.schema.js";
import { loginSchema } from "./schemas/login.schema.js";
import {
  registerParent,
  registerTeacher,
  loginUser,
  getUserById,
} from "./auth.service.js";
import { z } from "zod";
import { sendSuccess } from "../../shared/http/api-response.js";
import { AppError } from "../../shared/errors/app-error.js";

function validateRegistration(req: Request) {
  const parsed = RegisterSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;

    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: errors,
      legacy: { errors },
    });
  }

  return parsed.data;
}

export async function registerController(
  req: Request,
  res: Response,
): Promise<void> {
  const user = await registerParent(validateRegistration(req));

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
}

export async function registerTeacherController(
  req: Request,
  res: Response,
): Promise<void> {
  const user = await registerTeacher(validateRegistration(req));

  sendSuccess({
    res,
    statusCode: 201,
    message: "Teacher account created successfully",
    data: {
      user,
    },
    legacy: {
      user,
    },
  });
}

export async function loginController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;

    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: errors,
      legacy: { errors },
    });
  }

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
}

export async function meController(req: Request, res: Response): Promise<void> {
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
}
