import type { Request, Response } from "express";
import { z } from "zod";

import { createAttemptSchema } from "./schemas/create-attempt.schema.js";
import {
  createAttempt,
  getAttemptById,
  getAttempts,
} from "./attempts.service.js";

export async function createAttemptController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = createAttemptSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: z.flattenError(parsed.error).fieldErrors,
    });

    return;
  }

  try {
    const attempt = await createAttempt(res.locals.auth.userId, parsed.data);

    res.status(201).json({
      message: "Attempt saved successfully",
      attempt,
    });
  } catch (error) {
    console.error("Create attempt error:", error);

    res.status(500).json({
      message: "Unable to save attempt",
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

    res.status(200).json(result);
  } catch (error) {
    console.error("Get attempts error:", error);

    res.status(500).json({
      message: "Unable to retrieve attempts",
    });
  }
}

export async function getAttemptByIdController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Attempt ID is required",
    });

    return;
  }

  try {
    const attempt = await getAttemptById(res.locals.auth.userId, id);

    if (!attempt) {
      res.status(404).json({
        message: "Attempt not found",
      });

      return;
    }

    res.status(200).json({
      attempt,
    });
  } catch (error) {
    console.error("Get attempt error:", error);

    res.status(500).json({
      message: "Unable to retrieve attempt",
    });
  }
}
