import type { Request, Response } from "express";

import {
  createLearningSession,
  getLearningSessions,
} from "./learning.service.js";
import { createLearningSessionSchema } from "../children/schemas/create-learning-session.schema.js";
import { getLearningSessionsSchema } from "./schemas/get-learning-sessions.schema.js";

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
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const parsed = createLearningSessionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid learning session payload.",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const session = await createLearningSession(
      auth.userId,
      auth.role,
      parsed.data,
    );

    return res.status(201).json({
      data: session,
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    if (statusCode === 403) {
      return res.status(403).json({
        message:
          error instanceof Error
            ? error.message
            : "You are not authorized to record learning for this child.",
      });
    }

    console.error("Failed to create learning session:", error);

    return res.status(500).json({
      message: "Failed to create learning session.",
    });
  }
}

export async function getLearningSessionsController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = getLearningSessionsSchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid learning history query.",
      errors: parsed.error.flatten(),
    });

    return;
  }

  try {
    const result = await getLearningSessions(
      res.locals.auth.userId,
      parsed.data,
    );

    res.status(200).json(result);
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    if (statusCode === 403) {
      res.status(403).json({
        message:
          error instanceof Error
            ? error.message
            : "You are not authorized to view learning history for this child.",
      });

      return;
    }

    console.error("Get learning sessions error:", error);

    res.status(500).json({
      message: "Unable to retrieve learning history.",
    });
  }
}
