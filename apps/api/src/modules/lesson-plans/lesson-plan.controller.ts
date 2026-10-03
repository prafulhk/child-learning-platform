import type { Request, Response } from "express";

import { createLessonPlanSchema } from "./schemas/create-lesson-plan.schema.js";
import {
  createLessonPlan,
  getLessonPlanById,
  getLessonPlans,
} from "./lesson-plan.service.js";
import { sendSuccess } from "../../shared/http/api-response.js";
import { AppError } from "../../shared/errors/app-error.js";

function getAuth(res: Response) {
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

  return auth;
}

export async function createLessonPlanController(req: Request, res: Response) {
  const auth = getAuth(res);

  const parsed = createLessonPlanSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid lesson plan payload.",
      details: errors,
      legacy: { errors },
    });
  }

  const lessonPlan = await createLessonPlan(auth.userId, parsed.data);

  sendSuccess({
    res,
    statusCode: 201,
    data: lessonPlan,
    legacy: {
      lessonPlan,
    },
  });
}

export async function getLessonPlansController(
  req: Request,
  res: Response,
): Promise<void> {
  const auth = getAuth(res);

  const childId =
    typeof req.query.childId === "string" ? req.query.childId : undefined;

  if (!childId) {
    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "childId is required.",
    });
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

  const result = await getLessonPlans(auth.userId, options);

  sendSuccess({
    res,
    statusCode: 200,
    data: result,
    legacy: result,
  });
}

export async function getLessonPlanByIdController(
  req: Request,
  res: Response,
): Promise<void> {
  const auth = getAuth(res);
  const planId = req.params.planId;

  const lessonPlan = await getLessonPlanById(auth.userId, planId);

  sendSuccess({
    res,
    statusCode: 200,
    data: lessonPlan,
    legacy: {
      lessonPlan,
    },
  });
}
