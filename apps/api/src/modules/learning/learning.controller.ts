import type { Request, Response } from "express";

import {
  createLearningSession,
  getLearningSessions,
} from "./learning.service.js";
import { createLearningSessionSchema } from "../children/schemas/create-learning-session.schema.js";
import { getLearningSessionsSchema } from "./schemas/get-learning-sessions.schema.js";
import { sendSuccess } from "../../shared/http/api-response.js";
import { AppError } from "../../shared/errors/app-error.js";

export async function createLearningSessionController(
  req: Request,
  res: Response,
) {
  const auth = res.locals.auth as
    | {
        userId: string;
        role: "PARENT" | "TEACHER";
      }
    | undefined;

  if (!auth) {
    throw new AppError({
      statusCode: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication required.",
    });
  }

  const parsed = createLearningSessionSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid learning session payload.",
      details: errors,
      legacy: { errors },
    });
  }

  const session = await createLearningSession(
    auth.userId,
    auth.role,
    parsed.data,
  );

  sendSuccess({
    res,
    statusCode: 201,
    data: session,
  });
}

export async function getLearningSessionsController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = getLearningSessionsSchema.safeParse(req.query);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid learning history query.",
      details: errors,
      legacy: { errors },
    });
  }

  const result = await getLearningSessions(res.locals.auth.userId, parsed.data);

  sendSuccess({
    res,
    statusCode: 200,
    data: result,
    legacy: result,
  });
}
