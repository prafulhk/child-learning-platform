import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/role.middleware.js";
import {
  createSubjectController,
  getAdminSubjectsController,
  updateSubjectController,
  updateSubjectStatusController,
} from "./admin-subject.controller.js";
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

catalogRouter.get("/admin/all", authMiddleware, adminOnly, getAdminSubjectsController);
catalogRouter.post("/", authMiddleware, adminOnly, createSubjectController);
catalogRouter.post(
  "/:subjectId/update",
  authMiddleware,
  adminOnly,
  updateSubjectController,
);
catalogRouter.post(
  "/:subjectId/status",
  authMiddleware,
  adminOnly,
  updateSubjectStatusController,
);
