import type { Request, Response } from "express";
import { z } from "zod";

import { createChildSchema } from "./schemas/create-child.schema.js";
import { createChild, getChildrenByParent } from "./children.service.js";

export async function createChildController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = createChildSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
    return;
  }

  try {
    const child = await createChild(res.locals.auth.userId, parsed.data);

    res.status(201).json({
      message: "Child created successfully",
      child,
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

    res.status(statusCode).json({
      message,
    });
  }
}

export async function getChildrenController(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const children = await getChildrenByParent(res.locals.auth.userId);

    res.status(200).json({
      children,
    });
  } catch (error) {
    console.error("Get children error:", error);

    res.status(500).json({
      message: "Unable to retrieve children",
    });
  }
}
