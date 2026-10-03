import type { Request, Response } from "express";
import { z } from "zod";

import { createChildSchema } from "./schemas/create-child.schema.js";
import { createChild, getChildrenByParent } from "./children.service.js";
import { sendError, sendSuccess } from "../../shared/http/api-response.js";

export async function createChildController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = createChildSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;

    sendError({
      res,
      statusCode: 400,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: errors,
      legacy: {
        errors,
      },
    });

    return;
  }

  try {
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
  } catch (error) {
    console.error("Create child error:", error);

    const statusCode =
      error instanceof Error &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    const message =
      statusCode === 409 && error instanceof Error
        ? error.message
        : "Unable to create child";

    sendError({
      res,
      statusCode,
      message,
      code: statusCode === 409 ? "CHILD_CONFLICT" : "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function getChildrenController(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
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
  } catch (error) {
    console.error("Get children error:", error);

    sendError({
      res,
      statusCode: 500,
      message: "Unable to retrieve children",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
