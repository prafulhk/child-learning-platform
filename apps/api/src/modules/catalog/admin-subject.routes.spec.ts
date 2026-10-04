import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { config } from "../../config/index.js";
import { UserModel } from "../auth/models/user.model.js";
import { SubjectModel } from "./models/subject.model.js";

async function createToken(role: "ADMIN" | "PARENT" | "TEACHER", email: string) {
  const user = await UserModel.create({
    name: `Subject ${role}`,
    email,
    passwordHash: "test-password-hash",
    role,
  });

  return jwt.sign(
    { sub: user._id.toString(), role },
    config.JWT_SECRET,
    { expiresIn: "1h" },
  );
}

describe("Admin Subject Management API", () => {
  it("allows an admin to create a subject", async () => {
    const token = await createToken("ADMIN", "admin-subject-create@example.com");

    const response = await request(app)
      .post("/api/subjects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Mathematics",
        code: "math",
        description: "Core mathematics",
        sortOrder: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.subject.name).toBe("Mathematics");
    expect(response.body.data.subject.code).toBe("MATH");
    expect(response.body.data.subject.status).toBe("ACTIVE");
  });

  it("rejects parent subject management", async () => {
    const token = await createToken("PARENT", "parent-subject-management@example.com");

    const response = await request(app)
      .post("/api/subjects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Science", code: "SCI", sortOrder: 2 });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("rejects teacher subject management", async () => {
    const token = await createToken("TEACHER", "teacher-subject-management@example.com");

    const response = await request(app)
      .post("/api/subjects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Science", code: "SCI", sortOrder: 2 });

    expect(response.status).toBe(403);
  });

  it("allows an admin to edit and deactivate a subject", async () => {
    const token = await createToken("ADMIN", "admin-subject-edit@example.com");
    const subject = await SubjectModel.create({
      name: "English",
      code: "ENG",
      sortOrder: 2,
      status: "ACTIVE",
    });

    const updateResponse = await request(app)
      .post(`/api/subjects/${subject._id.toString()}/update`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "English Language", sortOrder: 3 });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.subject.name).toBe("English Language");
    expect(updateResponse.body.data.subject.sortOrder).toBe(3);

    const statusResponse = await request(app)
      .post(`/api/subjects/${subject._id.toString()}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "INACTIVE" });

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.data.subject.status).toBe("INACTIVE");
  });

  it("returns all subjects, including inactive ones, to admins", async () => {
    const token = await createToken("ADMIN", "admin-subject-list@example.com");

    await SubjectModel.create([
      { name: "Active Subject", code: "ACTIVE", sortOrder: 1, status: "ACTIVE" },
      { name: "Inactive Subject", code: "INACTIVE", sortOrder: 2, status: "INACTIVE" },
    ]);

    const response = await request(app)
      .get("/api/subjects/admin/all")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });
});
