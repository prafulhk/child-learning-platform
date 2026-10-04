import { describe, expect, it } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { config } from "../../config/index.js";
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

  it("creates a teacher account with the TEACHER role", async () => {
    const password = "TeacherPassword123";

    const response = await request(app)
      .post("/api/auth/register/teacher")
      .send({
        name: "Registration Teacher",
        email: "registration-teacher@example.com",
        password,
        confirmPassword: password,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Teacher account created successfully");
    expect(response.body.data.user).toMatchObject({
      name: "Registration Teacher",
      email: "registration-teacher@example.com",
      role: "TEACHER",
    });
    expect(response.body.data.user.passwordHash).toBeUndefined();

    const user = await UserModel.findOne({
      email: "registration-teacher@example.com",
    }).select("+passwordHash");

    expect(user).not.toBeNull();
    expect(user?.role).toBe("TEACHER");
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

  it("updates the authenticated user's permitted profile fields", async () => {
    const user = await UserModel.create({
      name: "Profile Parent",
      email: "profile-parent@example.com",
      passwordHash: await bcrypt.hash("ProfilePassword123", 12),
      role: "PARENT",
    });

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const response = await request(app)
      .patch("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Parent" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Profile updated successfully");
    expect(response.body.data.user).toMatchObject({
      name: "Updated Parent",
      email: "profile-parent@example.com",
      role: "PARENT",
    });

    const updatedUser = await UserModel.findById(user._id);
    expect(updatedUser?.name).toBe("Updated Parent");
  });

  it("rejects profile updates without authentication", async () => {
    const response = await request(app)
      .patch("/api/auth/me")
      .send({ name: "Updated Parent" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.status).toBe("ok");
  });
});
