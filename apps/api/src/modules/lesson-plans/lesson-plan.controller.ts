import type { Request, Response } from "express";

import { createLessonPlanSchema } from "./schemas/create-lesson-plan.schema.js";
import { createLessonPlan, getLessonPlans } from "./lesson-plan.service.js";
import { sendError, sendSuccess } from "../../shared/http/api-response.js";

export async function createLessonPlanController(req: Request, res: Response) {
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

  const parsed = createLessonPlanSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    sendError({
      res,
      statusCode: 400,
      message: "Invalid lesson plan payload.",
      code: "VALIDATION_ERROR",
      details: errors,
      legacy: {
        errors,
      },
    });

    return;
  }

  try {
    const lessonPlan = await createLessonPlan(auth.userId, parsed.data);

    sendSuccess({
      res,
      statusCode: 201,
      data: lessonPlan,
      legacy: {
        lessonPlan,
      },
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
            : "You are not authorized to create a lesson plan for this child.",
        code: "FORBIDDEN",
      });

      return;
    }

    console.error("Failed to create lesson plan:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Failed to create lesson plan.",
      code: "INTERNAL_SERVER_ERROR",
    });

    return;
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
    sendError({
      res,
      statusCode: 401,
      message: "Authentication required.",
      code: "AUTHENTICATION_REQUIRED",
    });

    return;
  }

  const childId =
    typeof req.query.childId === "string" ? req.query.childId : undefined;

  if (!childId) {
    sendError({
      res,
      statusCode: 400,
      message: "childId is required.",
      code: "VALIDATION_ERROR",
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
            : "You are not authorized to view lesson plans for this child.",
        code: "FORBIDDEN",
      });

      return;
    }

    console.error("Get lesson plans error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to retrieve lesson plans.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
