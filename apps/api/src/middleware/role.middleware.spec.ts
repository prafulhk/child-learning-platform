import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

import { config } from "../config/index.js";
import { authMiddleware } from "./auth.middleware.js";
import { adminOnly } from "./role.middleware.js";

function createToken(role: "PARENT" | "TEACHER" | "ADMIN") {
  return jwt.sign(
    {
      sub: "507f1f77bcf86cd799439011",
      role,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" },
  );
}

describe("Role authorization middleware", () => {
  function createApp() {
    const app = express();
    app.get("/admin", authMiddleware, adminOnly, (_req, res) => {
      res.status(200).json({ success: true });
    });
    return app;
  }

  it("allows an ADMIN token", async () => {
    const response = await request(createApp())
      .get("/admin")
      .set("Authorization", `Bearer ${createToken("ADMIN")}`);

    expect(response.status).toBe(200);
  });

  it("rejects a PARENT token", async () => {
    const response = await request(createApp())
      .get("/admin")
      .set("Authorization", `Bearer ${createToken("PARENT")}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("rejects a TEACHER token", async () => {
    const response = await request(createApp())
      .get("/admin")
      .set("Authorization", `Bearer ${createToken("TEACHER")}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });
});
