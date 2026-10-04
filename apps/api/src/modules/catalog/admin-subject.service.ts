import { Types } from "mongoose";

import { SubjectModel } from "./models/subject.model.js";
import type { CreateSubjectInput } from "./schemas/create-subject.schema.js";
import type { UpdateSubjectInput } from "./schemas/update-subject.schema.js";
import type { UpdateSubjectStatusInput } from "./schemas/update-subject-status.schema.js";
import { AppError } from "../../shared/errors/app-error.js";

function ensureSubjectId(subjectId: string): void {
  if (!Types.ObjectId.isValid(subjectId)) {
    throw new AppError({
      statusCode: 404,
      code: "SUBJECT_NOT_FOUND",
      message: "Subject not found.",
    });
  }
}

export async function createSubject(input: CreateSubjectInput) {
  const code = input.code.trim().toUpperCase();
  const existing = await SubjectModel.findOne({ code }).lean();

  if (existing) {
    throw new AppError({
      statusCode: 409,
      code: "SUBJECT_CONFLICT",
      message: "A subject with this code already exists.",
    });
  }

  return SubjectModel.create({
    name: input.name.trim(),
    code,
    ...(input.description ? { description: input.description.trim() } : {}),
    sortOrder: input.sortOrder,
    category: "ACADEMIC",
    status: "ACTIVE",
  });
}

export async function getAllSubjects() {
  return SubjectModel.find().sort({ sortOrder: 1, name: 1 }).lean();
}

export async function updateSubject(subjectId: string, input: UpdateSubjectInput) {
  ensureSubjectId(subjectId);

  const subject = await SubjectModel.findById(subjectId);
  if (!subject) {
    throw new AppError({
      statusCode: 404,
      code: "SUBJECT_NOT_FOUND",
      message: "Subject not found.",
    });
  }

  if (input.code !== undefined) {
    const code = input.code.trim().toUpperCase();
    const duplicate = await SubjectModel.findOne({
      _id: { $ne: subject._id },
      code,
    }).lean();

    if (duplicate) {
      throw new AppError({
        statusCode: 409,
        code: "SUBJECT_CONFLICT",
        message: "A subject with this code already exists.",
      });
    }

    subject.code = code;
  }

  if (input.name !== undefined) subject.name = input.name.trim();
  if (input.description !== undefined) subject.description = input.description.trim();
  if (input.sortOrder !== undefined) subject.sortOrder = input.sortOrder;

  await subject.save();
  return subject;
}

export async function updateSubjectStatus(
  subjectId: string,
  input: UpdateSubjectStatusInput,
) {
  ensureSubjectId(subjectId);

  const subject = await SubjectModel.findByIdAndUpdate(
    subjectId,
    { status: input.status },
    { new: true, runValidators: true },
  );

  if (!subject) {
    throw new AppError({
      statusCode: 404,
      code: "SUBJECT_NOT_FOUND",
      message: "Subject not found.",
    });
  }

  return subject;
}
