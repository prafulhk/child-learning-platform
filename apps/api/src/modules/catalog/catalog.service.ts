import { Types } from "mongoose";

import { SubjectModel } from "./models/subject.model.js";
import { TopicModel } from "./models/topic.model.js";

export async function getActiveSubjects() {
  return SubjectModel.find({ status: "ACTIVE" })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
}

export async function getActiveTopicsBySubject(subjectId: string) {
  const subject = await SubjectModel.findOne({
    _id: new Types.ObjectId(subjectId),
  }).lean();

  if (!subject) {
    const error = new Error("Subject not found.");

    (error as Error & { statusCode?: number }).statusCode = 404;

    throw error;
  }

  return TopicModel.find({
    subjectId: new Types.ObjectId(subjectId),
    status: "ACTIVE",
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
}
