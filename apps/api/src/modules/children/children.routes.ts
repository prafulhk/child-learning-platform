import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createChildController,
  getChildrenController,
  updateChildController,
} from "./children.controller.js";

export const childrenRouter: Router = Router();

childrenRouter.post("/", authMiddleware, createChildController);

childrenRouter.get("/", authMiddleware, getChildrenController);

// Keep child profile updates on the same POST-based API pattern used by the existing child creation flow.
childrenRouter.post("/:childId/update", authMiddleware, updateChildController);

// Retain the REST-style PATCH endpoint for API compatibility.
childrenRouter.patch("/:childId", authMiddleware, updateChildController);
