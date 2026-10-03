import type { Request, Response } from "express";

import {
  getActiveSubjects,
  getActiveTopicsBySubject,
} from "./catalog.service.js";
import { getTopicsSchema } from "./schemas/get-topics.schema.js";
import { sendError, sendSuccess } from "../../shared/http/api-response.js";

export async function getSubjectsController(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const subjects = await getActiveSubjects();

    sendSuccess({
      res,
      statusCode: 200,
      data: subjects,
    });
  } catch (error) {
    console.error("Get subjects error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to retrieve subjects",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function getTopicsBySubjectController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = getTopicsSchema.safeParse(req.params);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    sendError({
      res,
      statusCode: 400,
      message: "Invalid subject ID.",
      code: "VALIDATION_ERROR",
      details: errors,
      legacy: {
        errors,
      },
    });

    return;
  }

  try {
    const topics = await getActiveTopicsBySubject(parsed.data.subjectId);

    sendSuccess({
      res,
      statusCode: 200,
      data: topics,
    });
  } catch (error) {
    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    if (statusCode === 404) {
      sendError({
        res,
        statusCode: 404,
        message: error instanceof Error ? error.message : "Subject not found.",
        code: "SUBJECT_NOT_FOUND",
      });

      return;
    }

    console.error("Get topics error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to retrieve topics",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
