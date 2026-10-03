import type { Request, Response } from "express";
import { z } from "zod";

import { createAttemptSchema } from "./schemas/create-attempt.schema.js";
import {
  createAttempt,
  getAttemptById,
  getAttempts,
} from "./attempts.service.js";
import { sendSuccess } from "../../shared/http/api-response.js";
import { AppError } from "../../shared/errors/app-error.js";

export async function createAttemptController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = createAttemptSchema.safeParse(req.body);

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

  const attempt = await createAttempt(res.locals.auth.userId, parsed.data);

  sendSuccess({
    res,
    statusCode: 201,
    message: "Attempt saved successfully",
    data: {
      attempt,
    },
    legacy: {
      attempt,
    },
  });
}

export async function getAttemptsController(
  req: Request,
  res: Response,
): Promise<void> {
  const type =
    req.query.type === "PRACTICE" || req.query.type === "ASSESSMENT"
      ? req.query.type
      : undefined;

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const result = await getAttempts(res.locals.auth.userId, {
    ...(type ? { type } : {}),
    page,
    limit,
  });

  sendSuccess({
    res,
    statusCode: 200,
    data: result,
    legacy: result,
  });
}

export async function getAttemptByIdController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const { id } = req.params;

  if (!id) {
    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Attempt ID is required",
    });
  }

  const attempt = await getAttemptById(res.locals.auth.userId, id);

  if (!attempt) {
    throw new AppError({
      statusCode: 404,
      code: "ATTEMPT_NOT_FOUND",
      message: "Attempt not found",
    });
  }

  sendSuccess({
    res,
    statusCode: 200,
    data: {
      attempt,
    },
    legacy: {
      attempt,
    },
  });
}
