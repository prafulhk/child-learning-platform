import type { Request, Response } from "express";

import { createLessonPlanSchema } from "./schemas/create-lesson-plan.schema.js";
import { createLessonPlan, getLessonPlans } from "./lesson-plan.service.js";

export async function createLessonPlanController(req: Request, res: Response) {
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

  const parsed = createLessonPlanSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid lesson plan payload.",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const lessonPlan = await createLessonPlan(auth.userId, parsed.data);

    return res.status(201).json({
      data: lessonPlan,
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
            : "You are not authorized to create a lesson plan for this child.",
      });
    }

    console.error("Failed to create lesson plan:", error);

    return res.status(500).json({
      message: "Failed to create lesson plan.",
    });
  }
}

export async function getLessonPlansController(
  req: Request,
  res: Response,
): Promise<void> {
  const auth = res.locals.auth as
    | {
        userId: string;
        role: "PARENT" | "TEACHER";
      }
    | undefined;

  if (!auth) {
    res.status(401).json({
      message: "Authentication required.",
    });

    return;
  }

  const childId =
    typeof req.query.childId === "string" ? req.query.childId : undefined;

  if (!childId) {
    res.status(400).json({
      message: "childId is required.",
    });

    return;
  }

  const fromDate =
    typeof req.query.fromDate === "string" ? req.query.fromDate : undefined;

  const toDate =
    typeof req.query.toDate === "string" ? req.query.toDate : undefined;

  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;

  const page =
    typeof req.query.page === "string" ? Number(req.query.page) : undefined;

  const limit =
    typeof req.query.limit === "string" ? Number(req.query.limit) : undefined;

  const options: {
    childId: string;
    fromDate?: string;
    toDate?: string;
    status?: "PLANNED" | "COMPLETED" | "CANCELLED";
    page?: number;
    limit?: number;
  } = {
    childId,
  };

  if (fromDate !== undefined) {
    options.fromDate = fromDate;
  }

  if (toDate !== undefined) {
    options.toDate = toDate;
  }

  if (
    status === "PLANNED" ||
    status === "COMPLETED" ||
    status === "CANCELLED"
  ) {
    options.status = status;
  }

  if (page !== undefined && !Number.isNaN(page)) {
    options.page = page;
  }

  if (limit !== undefined && !Number.isNaN(limit)) {
    options.limit = limit;
  }

  try {
    const result = await getLessonPlans(auth.userId, options);

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
            : "You are not authorized to view lesson plans for this child.",
      });

      return;
    }

    console.error("Get lesson plans error:", error);

    res.status(500).json({
      message: "Unable to retrieve lesson plans.",
    });
  }
}
