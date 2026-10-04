import { Router } from "express";

import {
  loginController,
  meController,
  registerController,
  registerTeacherController,
  updateMeController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const authRouter: Router = Router();

authRouter.post("/register", registerController);
authRouter.post("/register/teacher", registerTeacherController);
authRouter.post("/login", loginController);
authRouter.get("/me", authMiddleware, meController);

// Keep profile updates on the same POST-based API pattern used by the working child APIs.
authRouter.post("/me/update", authMiddleware, updateMeController);

// Retain the REST-style PATCH endpoint for API compatibility.
authRouter.patch("/me", authMiddleware, updateMeController);

export { authRouter };
