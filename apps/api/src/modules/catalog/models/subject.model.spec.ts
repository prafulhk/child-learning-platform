import { describe, expect, it } from "vitest";

import { SubjectModel } from "./subject.model.js";

const validSubject = () => ({
  name: "Mathematics",
  code: "mathematics",
  category: "ACADEMIC",
  sortOrder: 1,
  status: "ACTIVE",
});

describe("Subject model", () => {
  it("accepts a valid subject", async () => {
    const subject = new SubjectModel({
      ...validSubject(),
      description: "Core mathematics concepts and problem solving.",
    });

    await expect(subject.validate()).resolves.toBeUndefined();
  });

  it.each(["name", "code"])("requires %s", async (field) => {
    const data = validSubject();
    const subject = new SubjectModel(data);

    subject.set(field, undefined);

    await expect(subject.validate()).rejects.toMatchObject({
      errors: {
        [field]: expect.anything(),
      },
    });
  });

  it("rejects an invalid category", async () => {
    const subject = new SubjectModel({
      ...validSubject(),
      category: "VOCATIONAL",
    });

    await expect(subject.validate()).rejects.toMatchObject({
      errors: {
        category: expect.anything(),
      },
    });
  });

  it("rejects an invalid status", async () => {
    const subject = new SubjectModel({
      ...validSubject(),
      status: "ARCHIVED",
    });

    await expect(subject.validate()).rejects.toMatchObject({
      errors: {
        status: expect.anything(),
      },
    });
  });

  it("supports sortOrder and status values", async () => {
    const subject = new SubjectModel({
      ...validSubject(),
      code: "inactive-subject",
      sortOrder: 7,
      status: "INACTIVE",
    });

    await expect(subject.validate()).resolves.toBeUndefined();

    expect(subject.sortOrder).toBe(7);
    expect(subject.status).toBe("INACTIVE");
  });

  it("allows optional fields to be omitted", async () => {
    const subject = new SubjectModel(validSubject());

    await expect(subject.validate()).resolves.toBeUndefined();

    expect(subject.description).toBeUndefined();
  });

  it("registers the required indexes", () => {
    const indexes = SubjectModel.schema.indexes().map(([fields]) => fields);

    expect(indexes).toEqual(
      expect.arrayContaining([{ code: 1 }, { status: 1, sortOrder: 1 }]),
    );
  });

  it("rejects a duplicate code", async () => {
    await SubjectModel.init();

    await SubjectModel.create({
      name: "Mathematics",
      code: "mathematics",
      sortOrder: 1,
    });

    await expect(
      SubjectModel.create({
        name: "Duplicate Subject",
        code: "mathematics",
        sortOrder: 2,
      }),
    ).rejects.toMatchObject({
      code: 11000,
    });
  });
});
