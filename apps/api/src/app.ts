import express from "express";
import type { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./modules/auth/auth.routes.js";
import { childrenRouter } from "./modules/children/children.routes.js";

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/children", childrenRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "child-learning-api",
  });
});

export { app };
