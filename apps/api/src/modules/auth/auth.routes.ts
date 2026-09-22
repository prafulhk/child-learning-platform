import { Router } from "express";

import { loginController, registerController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const authRouter: Router = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

export { authRouter };
