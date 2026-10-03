import { describe, expect, it } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";

import { app } from "../../app.js";
import { UserModel } from "./models/user.model.js";

describe("Auth API", () => {
  it("returns 400 for invalid login data", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "invalid-email",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.message).toBe("Validation failed");
  });

  it("returns 400 for invalid registration data", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "A",
      email: "invalid-email",
      password: "short",
      confirmPassword: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.message).toBe("Validation failed");
  });

  it("creates a parent account and never stores the password in plain text", async () => {
    const password = "Password123";

    const response = await request(app).post("/api/auth/register").send({
      name: "Registration Parent",
      email: "registration-parent@example.com",
      password,
      confirmPassword: password,
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Parent account created successfully");
    expect(response.body.data.user).toMatchObject({
      name: "Registration Parent",
      email: "registration-parent@example.com",
      role: "PARENT",
    });
    expect(response.body.data.user.passwordHash).toBeUndefined();

    const user = await UserModel.findOne({
      email: "registration-parent@example.com",
    }).select("+passwordHash");

    expect(user).not.toBeNull();
    expect(user?.passwordHash).not.toBe(password);
    await expect(bcrypt.compare(password, user!.passwordHash)).resolves.toBe(true);
  });

  it("returns 409 when the registration email already exists", async () => {
    await UserModel.create({
      name: "Existing Parent",
      email: "duplicate-parent@example.com",
      passwordHash: await bcrypt.hash("ExistingPassword123", 12),
      role: "PARENT",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Duplicate Parent",
      email: "duplicate-parent@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("EMAIL_ALREADY_EXISTS");
    expect(response.body.message).toBe(
      "An account with this email already exists",
    );
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.status).toBe("ok");
  });
});
