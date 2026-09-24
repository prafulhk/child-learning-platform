import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { config } from "../../config/index.js";
import { ChildModel } from "../children/models/child.model.js";
import { UserModel } from "../auth/models/user.model.js";
import { LearningSessionModel } from "./models/learning-session.model.js";

describe("Learning Sessions API", () => {
  it("returns 401 when authentication is missing", async () => {
    const response = await request(app).post("/api/learning-sessions").send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required");
  });

  it("returns 401 when the token is invalid", async () => {
    const response = await request(app)
      .post("/api/learning-sessions")
      .set("Authorization", "Bearer invalid-token")
      .send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  it("creates a learning session for an authenticated parent", async () => {
    const user = await UserModel.create({
      name: "Test Parent",
      email: "test-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Test Child",
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

    const learningDate = new Date("2026-09-23T10:00:00.000Z");

    const response = await request(app)
      .post("/api/learning-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        childId: child._id.toString(),
        subjectId: subjectId.toString(),
        topicId: topicId.toString(),
        learningDate: learningDate.toISOString(),
        durationMinutes: 30,
        whatWasTaught: "Addition using small friends",
        performance: "GOOD",
        accuracy: {
          correct: 8,
          total: 10,
          percentage: 80,
        },
        notes: "Needs more practice with subtraction.",
      });

    expect(response.status).toBe(201);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.childId.toString()).toBe(child._id.toString());
    expect(response.body.data.subjectId.toString()).toBe(subjectId.toString());
    expect(response.body.data.topicId.toString()).toBe(topicId.toString());
    expect(response.body.data.durationMinutes).toBe(30);
    expect(response.body.data.whatWasTaught).toBe(
      "Addition using small friends",
    );
    expect(response.body.data.performance).toBe("GOOD");
    expect(response.body.data.accuracy.percentage).toBe(80);
    expect(response.body.data.createdByUserId.toString()).toBe(
      user._id.toString(),
    );
    expect(response.body.data.createdByRole).toBe("PARENT");

    const savedSession = await LearningSessionModel.findOne({
      childId: child._id,
    });

    expect(savedSession).not.toBeNull();
    expect(savedSession?.durationMinutes).toBe(30);
    expect(savedSession?.whatWasTaught).toBe("Addition using small friends");
  });

  it("returns 400 when the learning session payload is invalid", async () => {
    const user = await UserModel.create({
      name: "Test Parent",
      email: "validation-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Validation Child",
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
      .post("/api/learning-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        childId: child._id.toString(),
        // subjectId intentionally missing
        // topicId intentionally missing
        learningDate: "not-a-date",
        durationMinutes: -10,
        whatWasTaught: "",
        performance: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid learning session payload.");
    expect(response.body.errors).toBeDefined();
  });

  it("returns 403 when the parent does not own the child", async () => {
    const parentA = await UserModel.create({
      name: "Parent A",
      email: "parent-a@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const parentB = await UserModel.create({
      name: "Parent B",
      email: "parent-b@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const childOfParentB = await ChildModel.create({
      parentId: parentB._id,
      name: "Parent B Child",
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
      .post("/api/learning-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        childId: childOfParentB._id.toString(),
        subjectId: new Types.ObjectId().toString(),
        topicId: new Types.ObjectId().toString(),
        learningDate: new Date().toISOString(),
        durationMinutes: 30,
        whatWasTaught: "Addition using small friends",
        performance: "GOOD",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You are not authorized to record learning for this child.",
    );

    const savedSession = await LearningSessionModel.findOne({
      childId: childOfParentB._id,
    });

    expect(savedSession).toBeNull();
  });

  it("returns learning history for an authenticated parent, newest first", async () => {
    const user = await UserModel.create({
      name: "History Parent",
      email: "history-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "History Child",
    });

    const subjectId = new Types.ObjectId();
    const topicId = new Types.ObjectId();

    const olderDate = new Date("2026-09-20T10:00:00.000Z");
    const newerDate = new Date("2026-09-23T10:00:00.000Z");

    await LearningSessionModel.create([
      {
        childId: child._id,
        subjectId,
        topicId,
        learningDate: olderDate,
        durationMinutes: 20,
        whatWasTaught: "Older lesson",
        performance: "GOOD",
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
      {
        childId: child._id,
        subjectId,
        topicId,
        learningDate: newerDate,
        durationMinutes: 30,
        whatWasTaught: "Newer lesson",
        performance: "EXCELLENT",
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
      .get("/api/learning-sessions")
      .set("Authorization", `Bearer ${token}`)
      .query({
        childId: child._id.toString(),
      });

    expect(response.status).toBe(200);

    expect(response.body.sessions).toHaveLength(2);

    expect(response.body.sessions[0].whatWasTaught).toBe("Newer lesson");

    expect(response.body.sessions[1].whatWasTaught).toBe("Older lesson");

    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    });
  });

  it("filters learning history by date, subject, and topic", async () => {
    const user = await UserModel.create({
      name: "Filter Parent",
      email: "filter-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Filter Child",
    });

    const matchingSubjectId = new Types.ObjectId();
    const otherSubjectId = new Types.ObjectId();

    const matchingTopicId = new Types.ObjectId();
    const otherTopicId = new Types.ObjectId();

    await LearningSessionModel.create([
      {
        childId: child._id,
        subjectId: matchingSubjectId,
        topicId: matchingTopicId,
        learningDate: new Date("2026-09-20T10:00:00.000Z"),
        durationMinutes: 30,
        whatWasTaught: "Matching lesson",
        performance: "GOOD",
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
      {
        childId: child._id,
        subjectId: matchingSubjectId,
        topicId: otherTopicId,
        learningDate: new Date("2026-09-21T10:00:00.000Z"),
        durationMinutes: 30,
        whatWasTaught: "Wrong topic",
        performance: "GOOD",
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
      {
        childId: child._id,
        subjectId: otherSubjectId,
        topicId: matchingTopicId,
        learningDate: new Date("2026-09-22T10:00:00.000Z"),
        durationMinutes: 30,
        whatWasTaught: "Wrong subject",
        performance: "GOOD",
        createdByUserId: user._id,
        createdByRole: "PARENT",
      },
      {
        childId: child._id,
        subjectId: matchingSubjectId,
        topicId: matchingTopicId,
        learningDate: new Date("2026-09-25T10:00:00.000Z"),
        durationMinutes: 30,
        whatWasTaught: "Outside date range",
        performance: "GOOD",
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
      .get("/api/learning-sessions")
      .set("Authorization", `Bearer ${token}`)
      .query({
        childId: child._id.toString(),
        fromDate: "2026-09-19",
        toDate: "2026-09-23",
        subjectId: matchingSubjectId.toString(),
        topicId: matchingTopicId.toString(),
      });

    expect(response.status).toBe(200);

    expect(response.body.sessions).toHaveLength(1);

    expect(response.body.sessions[0].whatWasTaught).toBe("Matching lesson");

    expect(response.body.pagination.total).toBe(1);
  });

  it("returns 403 when the parent does not own the child", async () => {
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
      name: "Parent B Child",
    });

    await LearningSessionModel.create({
      childId: childOfParentB._id,
      subjectId: new Types.ObjectId(),
      topicId: new Types.ObjectId(),
      learningDate: new Date("2026-09-23T10:00:00.000Z"),
      durationMinutes: 30,
      whatWasTaught: "Private lesson",
      performance: "GOOD",
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
      .get("/api/learning-sessions")
      .set("Authorization", `Bearer ${token}`)
      .query({
        childId: childOfParentB._id.toString(),
      });

    expect(response.status).toBe(403);

    expect(response.body.message).toBe(
      "You are not authorized to view learning history for this child.",
    );

    const sessions = await LearningSessionModel.find({
      childId: childOfParentB._id,
    });

    expect(sessions).toHaveLength(1);
  });
});
