import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { config } from "../../config/index.js";
import { ChildModel } from "../children/models/child.model.js";
import { UserModel } from "../auth/models/user.model.js";
import { LessonPlanModel } from "./lesson-plan.model.js";

describe("Lesson Plan Detail API", () => {
  it("returns 401 when authentication is missing", async () => {
    const response = await request(app).get(
      `/api/lesson-plans/${new Types.ObjectId().toString()}`,
    );

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Authentication required");
  });

  it("returns a lesson plan owned by the authenticated parent", async () => {
    const user = await UserModel.create({
      name: "Detail Parent",
      email: "detail-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Detail Child",
    });

    const lessonPlan = await LessonPlanModel.create({
      childId: child._id,
      subjectId: new Types.ObjectId(),
      topicId: new Types.ObjectId(),
      plannedDate: new Date("2026-10-05T10:00:00.000Z"),
      plannedActivity: "Practice single digit addition",
      plannedDurationMinutes: 30,
      notes: "Focus on accuracy.",
      createdByUserId: user._id,
      createdByRole: "PARENT",
    });

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        role: "PARENT",
      },
      config.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get(`/api/lesson-plans/${lessonPlan._id.toString()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data._id.toString()).toBe(lessonPlan._id.toString());
    expect(response.body.data.plannedActivity).toBe(
      "Practice single digit addition",
    );
    expect(response.body.data.notes).toBe("Focus on accuracy.");
  });

  it("returns 404 when the lesson plan belongs to another parent", async () => {
    const owner = await UserModel.create({
      name: "Detail Owner",
      email: "detail-owner@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const otherParent = await UserModel.create({
      name: "Other Detail Parent",
      email: "other-detail-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: owner._id,
      name: "Private Detail Child",
    });

    const lessonPlan = await LessonPlanModel.create({
      childId: child._id,
      subjectId: new Types.ObjectId(),
      topicId: new Types.ObjectId(),
      plannedDate: new Date("2026-10-05T10:00:00.000Z"),
      plannedActivity: "Private lesson",
      plannedDurationMinutes: 30,
      createdByUserId: owner._id,
      createdByRole: "PARENT",
    });

    const token = jwt.sign(
      {
        sub: otherParent._id.toString(),
        role: "PARENT",
      },
      config.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get(`/api/lesson-plans/${lessonPlan._id.toString()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Lesson plan not found.");
  });

  it("returns 404 for an invalid lesson plan id", async () => {
    const user = await UserModel.create({
      name: "Invalid Detail Parent",
      email: "invalid-detail-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        role: "PARENT",
      },
      config.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/lesson-plans/not-a-valid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Lesson plan not found.");
  });
});
