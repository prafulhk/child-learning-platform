import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createChildController,
  getChildrenController,
} from "./children.controller.js";

export const childrenRouter: Router = Router();

childrenRouter.post("/", authMiddleware, createChildController);

childrenRouter.get("/", authMiddleware, getChildrenController);
