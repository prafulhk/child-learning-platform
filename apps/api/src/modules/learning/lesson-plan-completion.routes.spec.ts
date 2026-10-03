import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { config } from "../../config/index.js";
import { UserModel } from "../auth/models/user.model.js";
import { ChildModel } from "../children/models/child.model.js";
import { LessonPlanModel } from "../lesson-plans/lesson-plan.model.js";
import { LearningSessionModel } from "./models/learning-session.model.js";

describe("Lesson plan completion", () => {
  it("links the learning session and marks the lesson plan completed", async () => {
    const user = await UserModel.create({
      name: "Completion Parent",
      email: "completion-parent@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: user._id,
      name: "Completion Child",
    });

    const subjectId = new Types.ObjectId();
    const topicId = new Types.ObjectId();

    const lessonPlan = await LessonPlanModel.create({
      childId: child._id,
      plannedDate: new Date("2026-10-03T00:00:00.000Z"),
      subjectId,
      topicId,
      plannedActivity: "Single digit addition",
      plannedDurationMinutes: 30,
      status: "PLANNED",
      createdByUserId: user._id,
      createdByRole: "PARENT",
    });

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        role: "PARENT",
      },
      config.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .post("/api/learning-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        childId: child._id.toString(),
        subjectId: subjectId.toString(),
        topicId: topicId.toString(),
        lessonPlanId: lessonPlan._id.toString(),
        learningDate: new Date("2026-10-03T10:00:00.000Z").toISOString(),
        durationMinutes: 35,
        whatWasTaught: "Practised single digit addition.",
        performance: "GOOD",
        accuracy: {
          correct: 9,
          total: 10,
          percentage: 90,
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.lessonPlanId.toString()).toBe(
      lessonPlan._id.toString(),
    );

    const savedPlan = await LessonPlanModel.findById(lessonPlan._id);
    expect(savedPlan?.status).toBe("COMPLETED");
    expect(savedPlan?.completedLearningSessionId?.toString()).toBe(
      response.body.data._id.toString(),
    );

    const savedSession = await LearningSessionModel.findById(
      response.body.data._id,
    );
    expect(savedSession?.lessonPlanId?.toString()).toBe(
      lessonPlan._id.toString(),
    );
  });

  it("does not allow completing another parent's lesson plan", async () => {
    const owner = await UserModel.create({
      name: "Owner Parent",
      email: "completion-owner@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const otherParent = await UserModel.create({
      name: "Other Parent",
      email: "completion-other@example.com",
      passwordHash: "test-password-hash",
      role: "PARENT",
    });

    const child = await ChildModel.create({
      parentId: owner._id,
      name: "Owner Child",
    });

    const subjectId = new Types.ObjectId();
    const topicId = new Types.ObjectId();

    const lessonPlan = await LessonPlanModel.create({
      childId: child._id,
      plannedDate: new Date("2026-10-03T00:00:00.000Z"),
      subjectId,
      topicId,
      plannedActivity: "Private lesson",
      plannedDurationMinutes: 30,
      status: "PLANNED",
      createdByUserId: owner._id,
      createdByRole: "PARENT",
    });

    const token = jwt.sign(
      {
        sub: otherParent._id.toString(),
        role: "PARENT",
      },
      config.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .post("/api/learning-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        childId: child._id.toString(),
        subjectId: subjectId.toString(),
        topicId: topicId.toString(),
        lessonPlanId: lessonPlan._id.toString(),
        learningDate: new Date().toISOString(),
        durationMinutes: 30,
        whatWasTaught: "Unauthorized lesson",
        performance: "GOOD",
      });

    expect(response.status).toBe(403);

    const savedPlan = await LessonPlanModel.findById(lessonPlan._id);
    expect(savedPlan?.status).toBe("PLANNED");
  });
});
