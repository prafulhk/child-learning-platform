import { describe, expect, it } from "vitest";
import { Types } from "mongoose";
import { LearningSessionModel } from "./learning-session.model.js";

const validSession = () => ({
  childId: new Types.ObjectId(),
  subjectId: new Types.ObjectId(),
  topicId: new Types.ObjectId(),
  learningDate: new Date(),
  durationMinutes: 30,
  whatWasTaught: "Single-digit addition",
  performance: "EXCELLENT",
  createdByUserId: new Types.ObjectId(),
  createdByRole: "PARENT",
});

describe("LearningSession model", () => {
  it("accepts a valid learning session", async () => {
    const session = new LearningSessionModel(validSession());

    await expect(session.validate()).resolves.toBeUndefined();
  });

  it.each(["childId", "subjectId", "topicId"])("requires %s", async (field) => {
    const data = validSession();
    const session = new LearningSessionModel(data);

    session.set(field, undefined);

    await expect(session.validate()).rejects.toMatchObject({
      errors: {
        [field]: expect.anything(),
      },
    });
  });

  it("rejects negative duration", async () => {
    const session = new LearningSessionModel({
      ...validSession(),
      durationMinutes: -5,
    });

    await expect(session.validate()).rejects.toMatchObject({
      errors: {
        durationMinutes: expect.anything(),
      },
    });
  });

  it("rejects accuracy above 100%", async () => {
    const session = new LearningSessionModel({
      ...validSession(),
      accuracy: {
        correct: 11,
        total: 10,
        percentage: 110,
      },
    });

    await expect(session.validate()).rejects.toMatchObject({
      errors: {
        "accuracy.percentage": expect.anything(),
      },
    });
  });

  it("rejects an invalid creator role", async () => {
    const session = new LearningSessionModel({
      ...validSession(),
      createdByRole: "STUDENT",
    });

    await expect(session.validate()).rejects.toMatchObject({
      errors: {
        createdByRole: expect.anything(),
      },
    });
  });

  it("allows optional fields to be omitted", async () => {
    const session = new LearningSessionModel(validSession());

    await expect(session.validate()).resolves.toBeUndefined();

    expect(session.skillId).toBeUndefined();
    expect(session.lessonPlanId).toBeUndefined();
    expect(session.accuracy).toBeUndefined();
    expect(session.notes).toBeUndefined();
  });

  it("registers the required compound indexes", () => {
    const indexes = LearningSessionModel.schema
      .indexes()
      .map(([fields]) => fields);

    expect(indexes).toEqual(
      expect.arrayContaining([
        { childId: 1, learningDate: -1 },
        { childId: 1, subjectId: 1, learningDate: -1 },
        { childId: 1, topicId: 1, learningDate: -1 },
        { createdByUserId: 1, learningDate: -1 },
      ]),
    );
  });
});
