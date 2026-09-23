import { AttemptModel } from "./models/attempt.model.js";
import type { CreateAttemptInput } from "./schemas/create-attempt.schema.js";

export async function createAttempt(userId: string, input: CreateAttemptInput) {
  const existingAttempt = await AttemptModel.findOne({
    userId,
    clientAttemptId: input.clientAttemptId,
  }).lean();

  if (existingAttempt) {
    return existingAttempt;
  }

  const attempt = await AttemptModel.create({
    userId,
    ...(input.childId ? { childId: input.childId } : {}),
    attemptType: input.attemptType,
    clientAttemptId: input.clientAttemptId,
    ...(input.topicId ? { topicId: input.topicId } : {}),
    ...(input.assessmentId ? { assessmentId: input.assessmentId } : {}),
    ...(input.title ? { title: input.title } : {}),
    startedAt: new Date(input.startedAt),
    completedAt: new Date(input.completedAt),
    presentedQuestions: input.presentedQuestions,
    selectedAnswers: input.selectedAnswers,
    flaggedQuestionIds: input.flaggedQuestionIds,
    result: input.result,
  });

  return attempt;
}

interface GetAttemptsOptions {
  type?: "PRACTICE" | "ASSESSMENT";
  page?: number;
  limit?: number;
}

export async function getAttempts(
  userId: string,
  options: GetAttemptsOptions = {},
) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));

  const filter: {
    userId: string;
    attemptType?: "PRACTICE" | "ASSESSMENT";
  } = {
    userId,
  };

  if (options.type) {
    filter.attemptType = options.type;
  }

  const [attempts, total] = await Promise.all([
    AttemptModel.find(filter)
      .sort({ completedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    AttemptModel.countDocuments(filter),
  ]);

  return {
    attempts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAttemptById(userId: string, attemptId: string) {
  return AttemptModel.findOne({
    _id: attemptId,
    userId,
  }).lean();
}
