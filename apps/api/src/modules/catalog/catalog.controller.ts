import type { Request, Response } from "express";

import {
  getActiveSubjects,
  getActiveTopicsBySubject,
} from "./catalog.service.js";
import { getTopicsSchema } from "./schemas/get-topics.schema.js";

export async function getSubjectsController(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const subjects = await getActiveSubjects();

    res.status(200).json({
      data: subjects,
    });
  } catch (error) {
    console.error("Get subjects error:", error);

    res.status(500).json({
      message: "Unable to retrieve subjects",
    });
  }
}

export async function getTopicsBySubjectController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = getTopicsSchema.safeParse(req.params);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid subject ID.",
      errors: parsed.error.flatten(),
    });

    return;
  }

  try {
    const topics = await getActiveTopicsBySubject(parsed.data.subjectId);

    res.status(200).json({
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
      res.status(404).json({
        message:
          error instanceof Error ? error.message : "Subject not found.",
      });

      return;
    }

    console.error("Get topics error:", error);

    res.status(500).json({
      message: "Unable to retrieve topics",
    });
  }
}
