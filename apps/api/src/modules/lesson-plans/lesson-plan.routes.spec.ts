import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { config } from "../../config/index.js";
import { ChildModel } from "../children/models/child.model.js";
import { UserModel } from "../auth/models/user.model.js";
import { LessonPlanModel } from "./lesson-plan.model.js";

describe("Lesson Plans API", () => {
  it("returns 401 when authentication is missing", async () => {
    const response = await request(app).post("/api/lesson-plans").send({});

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
    expect(response.body.message).toBe("Authentication required");
  });

  it("returns 401 when the token is invalid", async () => {
    const response = await request(app)
      .post("/api/lesson-plans")
      .set("Authorization", "Bearer invalid-token")
      .send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  it("creates a lesson plan for an authenticated parent", async () => {
    const user = await UserModel.create({
      name: "Lesson Plan Parent",
      email: "lesson-plan-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Lesson Plan Child",
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

    const subjectId = new Types.ObjectId();
    const topicId = new Types.ObjectId();

    const plannedDate = new Date("2026-09-28T10:00:00.000Z");

    const response = await request(app)
      .post("/api/lesson-plans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        childId: child._id.toString(),
        subjectId: subjectId.toString(),
        topicId: topicId.toString(),
        plannedDate: plannedDate.toISOString(),
        plannedActivity: "Practice single digit addition",
        plannedDurationMinutes: 30,
        notes: "Focus on accuracy.",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.childId.toString()).toBe(child._id.toString());
    expect(response.body.data.subjectId.toString()).toBe(subjectId.toString());
    expect(response.body.data.topicId.toString()).toBe(topicId.toString());
    expect(response.body.data.plannedActivity).toBe(
      "Practice single digit addition",
    );
    expect(response.body.data.plannedDurationMinutes).toBe(30);
    expect(response.body.data.status).toBe("PLANNED");
    expect(response.body.data.createdByUserId.toString()).toBe(
      user._id.toString(),
    );
    expect(response.body.data.createdByRole).toBe("PARENT");

    const savedPlan = await LessonPlanModel.findOne({
      childId: child._id,
    });

    expect(savedPlan).not.toBeNull();
    expect(savedPlan?.plannedActivity).toBe("Practice single digit addition");
    expect(savedPlan?.plannedDurationMinutes).toBe(30);
    expect(savedPlan?.status).toBe("PLANNED");
  });

  it("returns 400 when the lesson plan payload is invalid", async () => {
    const user = await UserModel.create({
      name: "Validation Lesson Parent",
      email: "validation-lesson-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Validation Lesson Child",
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
      .post("/api/lesson-plans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        childId: child._id.toString(),
        // subjectId intentionally missing
        // topicId intentionally missing
        plannedDate: "not-a-date",
        plannedActivity: "",
        plannedDurationMinutes: -10,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.message).toBe("Invalid lesson plan payload.");
    expect(response.body.errors).toBeDefined();
  });

  it("returns 403 when the parent does not own the child", async () => {
    const parentA = await UserModel.create({
      name: "Lesson Parent A",
      email: "lesson-parent-a@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const parentB = await UserModel.create({
      name: "Lesson Parent B",
      email: "lesson-parent-b@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const childOfParentB = await ChildModel.create({
      parentId: parentB._id,
      name: "Parent B Lesson Child",
    });

    const token = jwt.sign(
      {
        sub: parentA._id.toString(),
        role: "PARENT",
      },
      config.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .post("/api/lesson-plans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        childId: childOfParentB._id.toString(),
        subjectId: new Types.ObjectId().toString(),
        topicId: new Types.ObjectId().toString(),
        plannedDate: new Date().toISOString(),
        plannedActivity: "Practice addition",
        plannedDurationMinutes: 30,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You are not authorized to create a lesson plan for this child.",
    );

    const savedPlan = await LessonPlanModel.findOne({
      childId: childOfParentB._id,
    });

    expect(savedPlan).toBeNull();
  });

  it("returns 401 when authentication is missing for lesson plan history", async () => {
    const response = await request(app).get("/api/lesson-plans").query({
      childId: new Types.ObjectId().toString(),
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required");
  });

  it("returns 400 when childId is missing", async () => {
    const user = await UserModel.create({
      name: "History Validation Parent",
      email: "history-validation-parent@example.com",
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
      .get("/api/lesson-plans")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("childId is required.");
  });

  it("returns lesson plans for an authenticated parent, sorted by planned date", async () => {
    const user = await UserModel.create({
      name: "History Lesson Parent",
      email: "history-lesson-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "History Lesson Child",
    });

    const subjectId = new Types.ObjectId();
    const topicId = new Types.ObjectId();

    await LessonPlanModel.create([
      {
        childId: child._id,
        subjectId,
        topicId,
        plannedDate: new Date("2026-09-30T10:00:00.000Z"),
        plannedActivity: "Later lesson",
        plannedDurationMinutes: 30,
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
      {
        childId: child._id,
        subjectId,
        topicId,
        plannedDate: new Date("2026-09-28T10:00:00.000Z"),
        plannedActivity: "Earlier lesson",
        plannedDurationMinutes: 20,
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
    ]);

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
      .get("/api/lesson-plans")
      .set("Authorization", `Bearer ${token}`)
      .query({
        childId: child._id.toString(),
      });

    expect(response.status).toBe(200);

    expect(response.body.plans).toHaveLength(2);

    expect(response.body.plans[0].plannedActivity).toBe("Earlier lesson");

    expect(response.body.plans[1].plannedActivity).toBe("Later lesson");

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    });
  });

  it("filters lesson plans by date and status", async () => {
    const user = await UserModel.create({
      name: "Filter Lesson Parent",
      email: "filter-lesson-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Filter Lesson Child",
    });

    const subjectId = new Types.ObjectId();
    const topicId = new Types.ObjectId();

    await LessonPlanModel.create([
      {
        childId: child._id,
        subjectId,
        topicId,
        plannedDate: new Date("2026-09-28T10:00:00.000Z"),
        plannedActivity: "Matching planned lesson",
        plannedDurationMinutes: 30,
        status: "PLANNED",
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
      {
        childId: child._id,
        subjectId,
        topicId,
        plannedDate: new Date("2026-09-29T10:00:00.000Z"),
        plannedActivity: "Completed lesson",
        plannedDurationMinutes: 30,
        status: "COMPLETED",
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
      {
        childId: child._id,
        subjectId,
        topicId,
        plannedDate: new Date("2026-10-05T10:00:00.000Z"),
        plannedActivity: "Outside date range",
        plannedDurationMinutes: 30,
        status: "PLANNED",
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
    ]);

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
      .get("/api/lesson-plans")
      .set("Authorization", `Bearer ${token}`)
      .query({
        childId: child._id.toString(),
        fromDate: "2026-09-28",
        toDate: "2026-09-30",
        status: "PLANNED",
      });

    expect(response.status).toBe(200);

    expect(response.body.plans).toHaveLength(1);

    expect(response.body.plans[0].plannedActivity).toBe(
      "Matching planned lesson",
    );

    expect(response.body.plans[0].status).toBe("PLANNED");

    expect(response.body.pagination.total).toBe(1);
  });

  it("returns 403 when viewing plans for a child not owned by the parent", async () => {
    const parentA = await UserModel.create({
      name: "History Parent A",
      email: "history-parent-a@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const parentB = await UserModel.create({
      name: "History Parent B",
      email: "history-parent-b@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const childOfParentB = await ChildModel.create({
      parentId: parentB._id,
      name: "Private Lesson Child",
    });

    await LessonPlanModel.create({
      childId: childOfParentB._id,
      subjectId: new Types.ObjectId(),
      topicId: new Types.ObjectId(),
      plannedDate: new Date("2026-09-28T10:00:00.000Z"),
      plannedActivity: "Private lesson",
      plannedDurationMinutes: 30,
      createdByUserId: parentB._id,
      createdByRole: "PARENT",
    });

    const token = jwt.sign(
      {
        sub: parentA._id.toString(),
        role: "PARENT",
      },
      config.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/lesson-plans")
      .set("Authorization", `Bearer ${token}`)
      .query({
        childId: childOfParentB._id.toString(),
      });

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "You are not authorized to view lesson plans for this child.",
    );

    const plans = await LessonPlanModel.find({
      childId: childOfParentB._id,
    });

    expect(plans).toHaveLength(1);
  });
});
