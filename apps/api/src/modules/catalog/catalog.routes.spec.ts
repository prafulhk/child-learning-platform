import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../app.js";
import { config } from "../../config/index.js";
import { UserModel } from "../auth/models/user.model.js";
import { SubjectModel } from "./models/subject.model.js";
import { TopicModel } from "./models/topic.model.js";

const createParentToken = async (email: string) => {
  const user = await UserModel.create({
    name: "Catalog Parent",
    email,
    passwordHash: "test-password-hash",
    role: "PARENT",
  });

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: "PARENT",
    },
    config.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
};

describe("Subjects and Topics API", () => {
  it("returns 401 when authentication is missing", async () => {
    const response = await request(app).get("/api/subjects");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required");
  });

  it("returns 401 when the token is invalid", async () => {
    const response = await request(app)
      .get("/api/subjects")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  it("returns an empty data list when no subjects exist", async () => {
    const token = await createParentToken("empty-catalog-parent@example.com");

    const response = await request(app)
      .get("/api/subjects")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  it("returns only active subjects ordered by sortOrder", async () => {
    await SubjectModel.create([
      {
        name: "Science",
        code: "science",
        sortOrder: 3,
        status: "ACTIVE",
      },
      {
        name: "Mathematics",
        code: "mathematics",
        sortOrder: 1,
        status: "ACTIVE",
      },
      {
        name: "English",
        code: "english",
        sortOrder: 2,
        status: "ACTIVE",
      },
      {
        name: "Retired Subject",
        code: "retired-subject",
        sortOrder: 0,
        status: "INACTIVE",
      },
    ]);

    const token = await createParentToken("subjects-parent@example.com");

    const response = await request(app)
      .get("/api/subjects")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(3);

    expect(
      response.body.data.map((subject: { code: string }) => subject.code),
    ).toEqual(["mathematics", "english", "science"]);
  });

  it("returns only active topics for the requested subject ordered by sortOrder", async () => {
    const subject = await SubjectModel.create({
      name: "Mathematics",
      code: "mathematics",
      sortOrder: 1,
      status: "ACTIVE",
    });

    const otherSubjectId = new Types.ObjectId();

    await TopicModel.create([
      {
        subjectId: subject._id,
        name: "Topic C",
        code: "topic-c",
        sortOrder: 3,
        status: "ACTIVE",
      },
      {
        subjectId: subject._id,
        name: "Topic A",
        code: "topic-a",
        sortOrder: 1,
        status: "ACTIVE",
      },
      {
        subjectId: subject._id,
        name: "Topic B",
        code: "topic-b",
        sortOrder: 2,
        status: "ACTIVE",
      },
      {
        subjectId: subject._id,
        name: "Retired Topic",
        code: "retired-topic",
        sortOrder: 0,
        status: "INACTIVE",
      },
      {
        subjectId: otherSubjectId,
        name: "Other Subject Topic",
        code: "other-subject-topic",
        sortOrder: 1,
        status: "ACTIVE",
      },
    ]);

    const token = await createParentToken("topics-parent@example.com");

    const response = await request(app)
      .get(`/api/subjects/${subject._id.toString()}/topics`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(3);

    expect(
      response.body.data.map((topic: { code: string }) => topic.code),
    ).toEqual(["topic-a", "topic-b", "topic-c"]);
  });

  it("returns 400 when the subjectId is not a valid ObjectId", async () => {
    const token = await createParentToken("invalid-id-parent@example.com");

    const response = await request(app)
      .get("/api/subjects/not-an-object-id/topics")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid subject ID.");
    expect(response.body.errors).toBeDefined();
  });

  it("returns 404 when the subject does not exist", async () => {
    const token = await createParentToken("missing-subject-parent@example.com");

    const response = await request(app)
      .get(`/api/subjects/${new Types.ObjectId().toString()}/topics`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Subject not found.");
  });

  it("returns an empty data list when the subject has no topics", async () => {
    const subject = await SubjectModel.create({
      name: "Empty Subject",
      code: "empty-subject",
      sortOrder: 1,
      status: "ACTIVE",
    });

    const token = await createParentToken("empty-topics-parent@example.com");

    const response = await request(app)
      .get(`/api/subjects/${subject._id.toString()}/topics`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });
});
