import { Router } from "express";

import { registerController } from "./auth.controller.js";

const authRouter: Router = Router();

authRouter.post("/register", registerController);

export { authRouter };
