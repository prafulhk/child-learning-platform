import { Types } from "mongoose";

import { ChildModel } from "../children/models/child.model.js";
import { LearningSessionModel } from "./models/learning-session.model.js";
import { CreateLearningSessionInput } from "../children/schemas/create-learning-session.schema.js";

interface GetLearningSessionsOptions {
  childId: string;
  fromDate?: string | undefined;
  toDate?: string | undefined;
  subjectId?: string | undefined;
  topicId?: string | undefined;
  page?: number;
  limit?: number;
}

export async function createLearningSession(
  userId: string,
  userRole: "PARENT" | "TEACHER",
  input: CreateLearningSessionInput,
) {
  const child = await ChildModel.findOne({
    _id: input.childId,
    parentId: userId,
  });

  if (!child) {
    const error = new Error(
      "You are not authorized to record learning for this child.",
    );

    (error as Error & { statusCode?: number }).statusCode = 403;

    throw error;
  }

  const sessionData = {
    childId: new Types.ObjectId(input.childId),
    subjectId: new Types.ObjectId(input.subjectId),
    topicId: new Types.ObjectId(input.topicId),
    learningDate: new Date(input.learningDate),
    durationMinutes: input.durationMinutes,
    whatWasTaught: input.whatWasTaught,
    performance: input.performance,
    createdByUserId: new Types.ObjectId(userId),
    createdByRole: userRole,

    ...(input.skillId ? { skillId: new Types.ObjectId(input.skillId) } : {}),

    ...(input.lessonPlanId
      ? { lessonPlanId: new Types.ObjectId(input.lessonPlanId) }
      : {}),

    ...(input.accuracy ? { accuracy: input.accuracy } : {}),

    ...(input.notes ? { notes: input.notes } : {}),
  };

  return LearningSessionModel.create(sessionData);
}

export async function getLearningSessions(
  userId: string,
  options: GetLearningSessionsOptions,
) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(50, Math.max(1, options.limit ?? 20));

  const child = await ChildModel.findOne({
    _id: options.childId,
    parentId: userId,
  }).lean();

  if (!child) {
    const error = new Error(
      "You are not authorized to view learning history for this child.",
    );

    (error as Error & { statusCode?: number }).statusCode = 403;

    throw error;
  }

  const filter: {
    childId: Types.ObjectId;
    learningDate?: {
      $gte?: Date;
      $lte?: Date;
    };
    subjectId?: Types.ObjectId;
    topicId?: Types.ObjectId;
  } = {
    childId: child._id,
  };

  if (options.fromDate || options.toDate) {
    filter.learningDate = {};

    if (options.fromDate) {
      filter.learningDate.$gte = new Date(`${options.fromDate}T00:00:00.000Z`);
    }

    if (options.toDate) {
      filter.learningDate.$lte = new Date(`${options.toDate}T23:59:59.999Z`);
    }
  }

  if (options.subjectId) {
    filter.subjectId = new Types.ObjectId(options.subjectId);
  }

  if (options.topicId) {
    filter.topicId = new Types.ObjectId(options.topicId);
  }

  const [sessions, total] = await Promise.all([
    LearningSessionModel.find(filter)
      .sort({ learningDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    LearningSessionModel.countDocuments(filter),
  ]);

  return {
    sessions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
