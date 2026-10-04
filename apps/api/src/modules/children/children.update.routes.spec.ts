import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { config } from "../../config/index.js";
import { ChildModel } from "./models/child.model.js";
import { UserModel } from "../auth/models/user.model.js";

function createToken(userId: string): string {
  return jwt.sign(
    {
      sub: userId,
      role: "PARENT",
    },
    config.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
}

describe("Child Update API", () => {
  it("returns 401 when authentication is missing", async () => {
    const response = await request(app).post(
      `/api/children/${new Types.ObjectId().toString()}/update`,
    );

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Authentication required");
  });

  it("updates a child owned by the authenticated parent", async () => {
    const user = await UserModel.create({
      name: "Update Parent",
      email: "update-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Old Name",
      grade: "UKG",
    });

    const response = await request(app)
      .post(`/api/children/${child._id.toString()}/update`)
      .set("Authorization", `Bearer ${createToken(user._id.toString())}`)
      .send({
        name: "New Name",
        dateOfBirth: "2020-08-10",
        grade: "Grade 1",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.child.name).toBe("New Name");
    expect(response.body.data.child.grade).toBe("Grade 1");

    const updatedChild = await ChildModel.findById(child._id).lean();
    expect(updatedChild?.name).toBe("New Name");
    expect(updatedChild?.grade).toBe("Grade 1");
    expect(updatedChild?.dateOfBirth?.toISOString()).toContain("2020-08-10");
  });

  it("prevents a parent from updating another parent's child", async () => {
    const owner = await UserModel.create({
      name: "Child Owner",
      email: "child-owner@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const otherParent = await UserModel.create({
      name: "Other Parent",
      email: "other-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: owner._id,
      name: "Private Child",
    });

    const response = await request(app)
      .post(`/api/children/${child._id.toString()}/update`)
      .set("Authorization", `Bearer ${createToken(otherParent._id.toString())}`)
      .send({ name: "Hacked Name" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Child not found.");

    const unchangedChild = await ChildModel.findById(child._id).lean();
    expect(unchangedChild?.name).toBe("Private Child");
  });

  it("rejects duplicate child names for the same parent", async () => {
    const user = await UserModel.create({
      name: "Duplicate Parent",
      email: "duplicate-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    await ChildModel.create({
      parentId: user._id,
      name: "Aarav",
    });

    const childToUpdate = await ChildModel.create({
      parentId: user._id,
      name: "Vihaan",
    });

    const response = await request(app)
      .post(`/api/children/${childToUpdate._id.toString()}/update`)
      .set("Authorization", `Bearer ${createToken(user._id.toString())}`)
      .send({ name: "Aarav" });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("A child with this name already exists.");
  });

  it("returns validation error when no update fields are provided", async () => {
    const user = await UserModel.create({
      name: "Validation Parent",
      email: "validation-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Validation Child",
    });

    const response = await request(app)
      .post(`/api/children/${child._id.toString()}/update`)
      .set("Authorization", `Bearer ${createToken(user._id.toString())}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
});
