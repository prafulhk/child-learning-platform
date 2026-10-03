import { Router } from "express";

import {
  loginController,
  meController,
  registerController,
  registerTeacherController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const authRouter: Router = Router();

authRouter.post("/register", registerController);
authRouter.post("/register/teacher", registerTeacherController);
authRouter.post("/login", loginController);
authRouter.get("/me", authMiddleware, meController);

export { authRouter };
