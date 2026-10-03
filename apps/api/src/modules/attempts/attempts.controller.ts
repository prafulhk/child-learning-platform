import type { Request, Response } from "express";
import { z } from "zod";

import { createAttemptSchema } from "./schemas/create-attempt.schema.js";
import {
  createAttempt,
  getAttemptById,
  getAttempts,
} from "./attempts.service.js";
import { sendError, sendSuccess } from "../../shared/http/api-response.js";

export async function createAttemptController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = createAttemptSchema.safeParse(req.body);

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
  } catch (error) {
    console.error("Create attempt error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to save attempt",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function getAttemptsController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
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
  } catch (error) {
    console.error("Get attempts error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to retrieve attempts",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function getAttemptByIdController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const { id } = req.params;

  if (!id) {
    sendError({
      res,
      statusCode: 400,
      message: "Attempt ID is required",
      code: "VALIDATION_ERROR",
    });

    return;
  }

  try {
    const attempt = await getAttemptById(res.locals.auth.userId, id);

    if (!attempt) {
      sendError({
        res,
        statusCode: 404,
        message: "Attempt not found",
        code: "ATTEMPT_NOT_FOUND",
      });

      return;
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
  } catch (error) {
    console.error("Get attempt error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to retrieve attempt",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
