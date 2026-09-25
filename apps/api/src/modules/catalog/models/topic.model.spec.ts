import { describe, expect, it } from "vitest";
import { Types } from "mongoose";

import { TopicModel } from "./topic.model.js";

const validTopic = () => ({
  subjectId: new Types.ObjectId(),
  name: "Single-Digit Addition",
  code: "single-digit-addition",
  sortOrder: 1,
  status: "ACTIVE",
});

describe("Topic model", () => {
  it("accepts a valid topic", async () => {
    const topic = new TopicModel({
      ...validTopic(),
      description: "Adding numbers from 0 to 9.",
    });

    await expect(topic.validate()).resolves.toBeUndefined();
  });

  it.each(["subjectId", "name", "code"])("requires %s", async (field) => {
    const data = validTopic();
    const topic = new TopicModel(data);

    topic.set(field, undefined);

    await expect(topic.validate()).rejects.toMatchObject({
      errors: {
        [field]: expect.anything(),
      },
    });
  });

  it("rejects an invalid status", async () => {
    const topic = new TopicModel({
      ...validTopic(),
      status: "ARCHIVED",
    });

    await expect(topic.validate()).rejects.toMatchObject({
      errors: {
        status: expect.anything(),
      },
    });
  });

  it("supports sortOrder and status values", async () => {
    const topic = new TopicModel({
      ...validTopic(),
      code: "inactive-topic",
      sortOrder: 12,
      status: "INACTIVE",
    });

    await expect(topic.validate()).resolves.toBeUndefined();

    expect(topic.sortOrder).toBe(12);
    expect(topic.status).toBe("INACTIVE");
  });

  it("allows optional fields to be omitted", async () => {
    const topic = new TopicModel(validTopic());

    await expect(topic.validate()).resolves.toBeUndefined();

    expect(topic.description).toBeUndefined();
  });

  it("registers the required indexes", () => {
    const indexes = TopicModel.schema.indexes().map(([fields]) => fields);

    expect(indexes).toEqual(
      expect.arrayContaining([
        { subjectId: 1, code: 1 },
        { subjectId: 1, status: 1 },
      ]),
    );
  });

  it("rejects a duplicate subjectId and code combination", async () => {
    await TopicModel.init();

    const subjectId = new Types.ObjectId();

    await TopicModel.create({
      subjectId,
      name: "Single-Digit Addition",
      code: "single-digit-addition",
      sortOrder: 1,
    });

    await expect(
      TopicModel.create({
        subjectId,
        name: "Duplicate Topic",
        code: "single-digit-addition",
        sortOrder: 2,
      }),
    ).rejects.toMatchObject({
      code: 11000,
    });
  });

  it("allows the same code under a different subject", async () => {
    await TopicModel.init();

    const subjectId = new Types.ObjectId();
    const otherSubjectId = new Types.ObjectId();

    await TopicModel.create({
      subjectId,
      name: "Single-Digit Addition",
      code: "single-digit-addition",
      sortOrder: 1,
    });

    await expect(
      TopicModel.create({
        subjectId: otherSubjectId,
        name: "Single-Digit Addition",
        code: "single-digit-addition",
        sortOrder: 1,
      }),
    ).resolves.toBeDefined();
  });
});
