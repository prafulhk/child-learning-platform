import type { Request, Response } from "express";

import {
  createLearningSession,
  getLearningSessions,
} from "./learning.service.js";
import { createLearningSessionSchema } from "../children/schemas/create-learning-session.schema.js";
import { getLearningSessionsSchema } from "./schemas/get-learning-sessions.schema.js";
import { sendError, sendSuccess } from "../../shared/http/api-response.js";

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
    sendError({
      res,
      statusCode: 401,
      message: "Authentication required.",
      code: "AUTHENTICATION_REQUIRED",
    });

    return;
  }

  const parsed = createLearningSessionSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    sendError({
      res,
      statusCode: 400,
      message: "Invalid learning session payload.",
      code: "VALIDATION_ERROR",
      details: errors,
      legacy: {
        errors,
      },
    });

    return;
  }

  try {
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

    return;
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    if (statusCode === 403) {
      sendError({
        res,
        statusCode: 403,
        message:
          error instanceof Error
            ? error.message
            : "You are not authorized to record learning for this child.",
        code: "FORBIDDEN",
      });

      return;
    }

    console.error("Failed to create learning session:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Failed to create learning session.",
      code: "INTERNAL_SERVER_ERROR",
    });

    return;
  }
}

export async function getLearningSessionsController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = getLearningSessionsSchema.safeParse(req.query);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    sendError({
      res,
      statusCode: 400,
      message: "Invalid learning history query.",
      code: "VALIDATION_ERROR",
      details: errors,
      legacy: {
        errors,
      },
    });

    return;
  }

  try {
    const result = await getLearningSessions(
      res.locals.auth.userId,
      parsed.data,
    );

    sendSuccess({
      res,
      statusCode: 200,
      data: result,
      legacy: result,
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    if (statusCode === 403) {
      sendError({
        res,
        statusCode: 403,
        message:
          error instanceof Error
            ? error.message
            : "You are not authorized to view learning history for this child.",
        code: "FORBIDDEN",
      });

      return;
    }

    console.error("Get learning sessions error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to retrieve learning history.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
