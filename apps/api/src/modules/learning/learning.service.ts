import { Types } from "mongoose";

import { ChildModel } from "../children/models/child.model.js";
import { LearningSessionModel } from "./models/learning-session.model.js";
import { CreateLearningSessionInput } from "../children/schemas/create-learning-session.schema.js";

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
