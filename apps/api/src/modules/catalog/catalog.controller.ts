import type { Request, Response } from "express";

import {
  getActiveSubjects,
  getActiveTopicsBySubject,
} from "./catalog.service.js";
import { getTopicsSchema } from "./schemas/get-topics.schema.js";
import { sendSuccess } from "../../shared/http/api-response.js";
import { AppError } from "../../shared/errors/app-error.js";

export async function getSubjectsController(
  _req: Request,
  res: Response,
): Promise<void> {
  const subjects = await getActiveSubjects();

  sendSuccess({
    res,
    statusCode: 200,
    data: subjects,
  });
}

export async function getTopicsBySubjectController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = getTopicsSchema.safeParse(req.params);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid subject ID.",
      details: errors,
      legacy: { errors },
    });
  }

  const topics = await getActiveTopicsBySubject(parsed.data.subjectId);

  sendSuccess({
    res,
    statusCode: 200,
    data: topics,
  });
}
