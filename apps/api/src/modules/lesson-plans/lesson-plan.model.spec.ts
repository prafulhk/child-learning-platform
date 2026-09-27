import { describe, expect, it } from "vitest";
import { Types } from "mongoose";

import { LessonPlanModel, type LessonPlanStatus } from "./lesson-plan.model.js";

function makeValidLessonPlan() {
  return {
    childId: new Types.ObjectId(),
    plannedDate: new Date("2026-09-28T10:00:00.000Z"),
    subjectId: new Types.ObjectId(),
    topicId: new Types.ObjectId(),
    plannedActivity: "Practice single digit addition",
    plannedDurationMinutes: 30,
    notes: "Focus on accuracy",
    status: "PLANNED" as LessonPlanStatus,
    createdByUserId: new Types.ObjectId(),
    createdByRole: "PARENT" as const,
  };
}

describe("LessonPlanModel", () => {
  it("creates a valid lesson plan", () => {
    const lessonPlan = new LessonPlanModel(makeValidLessonPlan());

    const error = lessonPlan.validateSync();

    expect(error).toBeUndefined();
  });

  it("defaults status to PLANNED", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      status: undefined,
    });

    expect(lessonPlan.status).toBe("PLANNED");
  });

  it("requires childId", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      childId: undefined,
    });

    const error = lessonPlan.validateSync();

    expect(error?.errors.childId).toBeDefined();
  });

  it("requires plannedDate", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      plannedDate: undefined,
    });

    const error = lessonPlan.validateSync();

    expect(error?.errors.plannedDate).toBeDefined();
  });

  it("requires subjectId", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      subjectId: undefined,
    });

    const error = lessonPlan.validateSync();

    expect(error?.errors.subjectId).toBeDefined();
  });

  it("requires topicId", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      topicId: undefined,
    });

    const error = lessonPlan.validateSync();

    expect(error?.errors.topicId).toBeDefined();
  });

  it("requires plannedActivity", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      plannedActivity: "",
    });

    const error = lessonPlan.validateSync();

    expect(error?.errors.plannedActivity).toBeDefined();
  });

  it("requires plannedDurationMinutes", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      plannedDurationMinutes: undefined,
    });

    const error = lessonPlan.validateSync();

    expect(error?.errors.plannedDurationMinutes).toBeDefined();
  });

  it("does not allow negative planned duration", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      plannedDurationMinutes: -1,
    });

    const error = lessonPlan.validateSync();

    expect(error?.errors.plannedDurationMinutes).toBeDefined();
  });

  it("allows optional skillId", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      skillId: new Types.ObjectId(),
    });

    const error = lessonPlan.validateSync();

    expect(error).toBeUndefined();
  });

  it("allows optional notes", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      notes: undefined,
    });

    const error = lessonPlan.validateSync();

    expect(error).toBeUndefined();
  });

  it("allows an optional completedLearningSessionId", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      status: "COMPLETED",
      completedLearningSessionId: new Types.ObjectId(),
    });

    const error = lessonPlan.validateSync();

    expect(error).toBeUndefined();
  });

  it("allows PLANNED, COMPLETED, and CANCELLED statuses", () => {
    const statuses: LessonPlanStatus[] = ["PLANNED", "COMPLETED", "CANCELLED"];

    for (const status of statuses) {
      const lessonPlan = new LessonPlanModel({
        ...makeValidLessonPlan(),
        status,
      });

      const error = lessonPlan.validateSync();

      expect(error).toBeUndefined();
    }
  });

  it("rejects an invalid status", () => {
    const lessonPlan = new LessonPlanModel({
      ...makeValidLessonPlan(),
      status: "INVALID",
    });

    const error = lessonPlan.validateSync();

    expect(error?.errors.status).toBeDefined();
  });

  it("uses the expected lesson plan indexes", () => {
    const indexes = LessonPlanModel.schema.indexes();

    expect(indexes).toEqual(
      expect.arrayContaining([
        [
          {
            childId: 1,
            plannedDate: 1,
          },
          {},
        ],
        [
          {
            childId: 1,
            status: 1,
            plannedDate: 1,
          },
          {},
        ],
      ]),
    );
  });

  it("enables timestamps", () => {
    expect(LessonPlanModel.schema.get("timestamps")).toBe(true);
  });
});
