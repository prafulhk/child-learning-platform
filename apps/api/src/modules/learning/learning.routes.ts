import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { createLearningSessionController } from "./learning.controller.js";

export const learningRouter: Router = Router();

learningRouter.post("/", authMiddleware, createLearningSessionController);
