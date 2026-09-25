import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  getSubjectsController,
  getTopicsBySubjectController,
} from "./catalog.controller.js";

export const catalogRouter: Router = Router();

catalogRouter.get("/", authMiddleware, getSubjectsController);

catalogRouter.get(
  "/:subjectId/topics",
  authMiddleware,
  getTopicsBySubjectController,
);
