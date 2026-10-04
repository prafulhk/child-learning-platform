import type { Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../shared/errors/app-error.js";
import { sendSuccess } from "../../shared/http/api-response.js";
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  updateSubjectStatus,
} from "./admin-subject.service.js";
import { createSubjectSchema } from "./schemas/create-subject.schema.js";
import { updateSubjectSchema } from "./schemas/update-subject.schema.js";
import { updateSubjectStatusSchema } from "./schemas/update-subject-status.schema.js";

function parseBody<T>(schema: z.ZodType<T>, req: Request): T {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: errors,
      legacy: { errors },
    });
  }
  return parsed.data;
}

function getSubjectId(req: Request): string {
  const subjectId = req.params.subjectId;
  if (!subjectId) {
    throw new AppError({
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Subject ID is required.",
    });
  }
  return subjectId;
}

export async function getAdminSubjectsController(
  _req: Request,
  res: Response,
): Promise<void> {
  const subjects = await getAllSubjects();
  sendSuccess({ res, statusCode: 200, data: subjects });
}

export async function createSubjectController(
  req: Request,
  res: Response,
): Promise<void> {
  const subject = await createSubject(parseBody(createSubjectSchema, req));
  sendSuccess({
    res,
    statusCode: 201,
    message: "Subject created successfully",
    data: { subject },
  });
}

export async function updateSubjectController(
  req: Request,
  res: Response,
): Promise<void> {
  const subject = await updateSubject(
    getSubjectId(req),
    parseBody(updateSubjectSchema, req),
  );
  sendSuccess({
    res,
    statusCode: 200,
    message: "Subject updated successfully",
    data: { subject },
  });
}

export async function updateSubjectStatusController(
  req: Request,
  res: Response,
): Promise<void> {
  const subject = await updateSubjectStatus(
    getSubjectId(req),
    parseBody(updateSubjectStatusSchema, req),
  );
  sendSuccess({
    res,
    statusCode: 200,
    message: "Subject status updated successfully",
    data: { subject },
  });
}
