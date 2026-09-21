import type { Request, Response } from "express";

import { RegisterSchema } from "./schemas/register.schema.js";
import { registerParent } from "./auth.service.js";

export async function registerController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const user = await registerParent(parsed.data);

    res.status(201).json({
      message: "Parent account created successfully",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "An account with this email already exists"
    ) {
      res.status(409).json({
        message: error.message,
      });
      return;
    }

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Unable to create account",
    });
  }
}
