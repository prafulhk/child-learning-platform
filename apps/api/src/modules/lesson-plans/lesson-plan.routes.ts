import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
  createLessonPlanController,
  getLessonPlansController,
} from "./lesson-plan.controller.js";

export const lessonPlanRouter: Router = Router();

lessonPlanRouter.post("/", authMiddleware, createLessonPlanController);

lessonPlanRouter.get("/", authMiddleware, getLessonPlansController);
