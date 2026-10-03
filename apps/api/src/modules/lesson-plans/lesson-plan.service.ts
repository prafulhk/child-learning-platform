import { Types } from "mongoose";

import { ChildModel } from "../children/models/child.model.js";
import { LessonPlanModel, type LessonPlanStatus } from "./lesson-plan.model.js";
import type { CreateLessonPlanInput } from "./schemas/create-lesson-plan.schema.js";
import { AppError } from "../../shared/errors/app-error.js";

export async function createLessonPlan(
  userId: string,
  input: CreateLessonPlanInput,
) {
  const child = await ChildModel.findOne({
    _id: input.childId,
    parentId: userId,
  });

  if (!child) {
    throw new AppError({
      statusCode: 403,
      code: "FORBIDDEN",
      message: "You are not authorized to create a lesson plan for this child.",
    });
  }

  const lessonPlanData = {
    childId: new Types.ObjectId(input.childId),
    plannedDate: new Date(input.plannedDate),
    subjectId: new Types.ObjectId(input.subjectId),
    topicId: new Types.ObjectId(input.topicId),
    plannedActivity: input.plannedActivity,
    plannedDurationMinutes: input.plannedDurationMinutes,
    createdByUserId: new Types.ObjectId(userId),
    createdByRole: "PARENT" as const,

    ...(input.skillId ? { skillId: new Types.ObjectId(input.skillId) } : {}),

    ...(input.notes ? { notes: input.notes } : {}),
  };

  return LessonPlanModel.create(lessonPlanData);
}

interface GetLessonPlansOptions {
  childId: string;
  fromDate?: string | undefined;
  toDate?: string | undefined;
  status?: LessonPlanStatus | undefined;
  page?: number;
  limit?: number;
}

export async function getLessonPlans(
  userId: string,
  options: GetLessonPlansOptions,
) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(50, Math.max(1, options.limit ?? 20));

  const child = await ChildModel.findOne({
    _id: options.childId,
    parentId: userId,
  }).lean();

  if (!child) {
    throw new AppError({
      statusCode: 403,
      code: "FORBIDDEN",
      message: "You are not authorized to view lesson plans for this child.",
    });
  }

  const filter: {
    childId: Types.ObjectId;
    plannedDate?: {
      $gte?: Date;
      $lte?: Date;
    };
    status?: LessonPlanStatus;
  } = {
    childId: child._id,
  };

  if (options.fromDate || options.toDate) {
    filter.plannedDate = {};

    if (options.fromDate) {
      filter.plannedDate.$gte = new Date(`${options.fromDate}T00:00:00.000Z`);
    }

    if (options.toDate) {
      filter.plannedDate.$lte = new Date(`${options.toDate}T23:59:59.999Z`);
    }
  }

  if (options.status) {
    filter.status = options.status;
  }

  const [plans, total] = await Promise.all([
    LessonPlanModel.find(filter)
      .sort({ plannedDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    LessonPlanModel.countDocuments(filter),
  ]);

  return {
    plans,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getLessonPlanById(userId: string, planId: string) {
  if (!Types.ObjectId.isValid(planId)) {
    throw new AppError({
      statusCode: 404,
      code: "NOT_FOUND",
      message: "Lesson plan not found.",
    });
  }

  const lessonPlan = await LessonPlanModel.findById(planId).lean();

  if (!lessonPlan) {
    throw new AppError({
      statusCode: 404,
      code: "NOT_FOUND",
      message: "Lesson plan not found.",
    });
  }

  const child = await ChildModel.findOne({
    _id: lessonPlan.childId,
    parentId: userId,
  }).lean();

  if (!child) {
    throw new AppError({
      statusCode: 404,
      code: "NOT_FOUND",
      message: "Lesson plan not found.",
    });
  }

  return lessonPlan;
}
