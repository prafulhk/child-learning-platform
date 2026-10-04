import type { Request, Response } from "express";
import { z } from "zod";

import { createChildSchema } from "./schemas/create-child.schema.js";
import { updateChildSchema } from "./schemas/update-child.schema.js";
import {
  createChild,
  getChildrenByParent,
  updateChild,
} from "./children.service.js";
import { sendSuccess } from "../../shared/http/api-response.js";
import { AppError } from "../../shared/errors/app-error.js";

export async function createChildController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = createChildSchema.safeParse(req.body);

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

  const child = await createChild(res.locals.auth.userId, parsed.data);

  sendSuccess({
    res,
    statusCode: 201,
    message: "Child created successfully",
    data: {
      child,
    },
    legacy: {
      child,
    },
  });
}

export async function getChildrenController(
  _req: Request,
  res: Response,
): Promise<void> {
  const children = await getChildrenByParent(res.locals.auth.userId);

  sendSuccess({
    res,
    statusCode: 200,
    data: {
      children,
    },
    legacy: {
      children,
    },
  });
}

export async function updateChildController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = updateChildSchema.safeParse(req.body);

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

  const child = await updateChild(
    res.locals.auth.userId,
    req.params.childId,
    parsed.data,
  );

  sendSuccess({
    res,
    statusCode: 200,
    message: "Child updated successfully",
    data: {
      child,
    },
    legacy: {
      child,
    },
  });
}
