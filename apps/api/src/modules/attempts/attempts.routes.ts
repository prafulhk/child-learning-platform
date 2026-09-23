import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
  createAttemptController,
  getAttemptByIdController,
  getAttemptsController,
} from "./attempts.controller.js";

export const attemptsRouter: Router = Router();

attemptsRouter.post("/", authMiddleware, createAttemptController);

attemptsRouter.get("/", authMiddleware, getAttemptsController);

attemptsRouter.get("/:id", authMiddleware, getAttemptByIdController);
