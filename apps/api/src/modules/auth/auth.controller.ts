import type { Request, Response } from "express";

import { RegisterSchema } from "./schemas/register.schema.js";
import { loginSchema } from "./schemas/login.schema.js";
import { registerParent, loginUser } from "./auth.service.js";
import { z } from "zod";

export async function registerController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: z.flattenError(parsed.error).fieldErrors,
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

export async function loginController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
    return;
  }

  try {
    const result = await loginUser(parsed.data);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    console.error("Login error:", error);

    res.status(500).json({
      message: "Unable to login",
    });
  }
}
