import { Types } from "mongoose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ChildModel } from "../children/models/child.model.js";
import { LessonPlanModel } from "./lesson-plan.model.js";
import { createLessonPlan, getLessonPlans } from "./lesson-plan.service.js";

describe("LessonPlan service", () => {
  const userId = new Types.ObjectId().toString();
  const childId = new Types.ObjectId().toString();
  const subjectId = new Types.ObjectId().toString();
  const topicId = new Types.ObjectId().toString();

  const child = {
    _id: new Types.ObjectId(childId),
    parentId: new Types.ObjectId(userId),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createLessonPlan", () => {
    it("creates a lesson plan for an authorized parent", async () => {
      vi.spyOn(ChildModel, "findOne").mockResolvedValue(child as never);

      const createdPlan = {
        _id: new Types.ObjectId(),
        childId: new Types.ObjectId(childId),
        subjectId: new Types.ObjectId(subjectId),
        topicId: new Types.ObjectId(topicId),
        plannedDate: new Date("2026-09-28T10:00:00.000Z"),
        plannedActivity: "Practice single digit addition",
        plannedDurationMinutes: 30,
        status: "PLANNED",
      };

      const createSpy = vi
        .spyOn(LessonPlanModel, "create")
        .mockResolvedValue(createdPlan as never);

      const result = await createLessonPlan(userId, {
        childId,
        subjectId,
        topicId,
        plannedDate: "2026-09-28T10:00:00.000Z",
        plannedActivity: "Practice single digit addition",
        plannedDurationMinutes: 30,
      });

      expect(result).toBe(createdPlan);
      expect(createSpy).toHaveBeenCalledTimes(1);

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          childId: expect.any(Types.ObjectId),
          subjectId: expect.any(Types.ObjectId),
          topicId: expect.any(Types.ObjectId),
          plannedDate: expect.any(Date),
          plannedActivity: "Practice single digit addition",
          plannedDurationMinutes: 30,
          createdByUserId: expect.any(Types.ObjectId),
          createdByRole: "PARENT",
        }),
      );
    });

    it("includes optional skillId when provided", async () => {
      vi.spyOn(ChildModel, "findOne").mockResolvedValue(child as never);

      const skillId = new Types.ObjectId().toString();

      const createSpy = vi
        .spyOn(LessonPlanModel, "create")
        .mockResolvedValue({} as never);

      await createLessonPlan(userId, {
        childId,
        subjectId,
        topicId,
        skillId,
        plannedDate: "2026-09-28T10:00:00.000Z",
        plannedActivity: "Practice addition",
        plannedDurationMinutes: 30,
      });

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          skillId: expect.any(Types.ObjectId),
        }),
      );
    });

    it("includes notes when provided", async () => {
      vi.spyOn(ChildModel, "findOne").mockResolvedValue(child as never);

      const createSpy = vi
        .spyOn(LessonPlanModel, "create")
        .mockResolvedValue({} as never);

      await createLessonPlan(userId, {
        childId,
        subjectId,
        topicId,
        plannedDate: "2026-09-28T10:00:00.000Z",
        plannedActivity: "Practice addition",
        plannedDurationMinutes: 30,
        notes: "Focus on accuracy",
      });

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: "Focus on accuracy",
        }),
      );
    });

    it("rejects a parent who does not own the child", async () => {
      vi.spyOn(ChildModel, "findOne").mockResolvedValue(null);

      const createSpy = vi.spyOn(LessonPlanModel, "create");

      await expect(
        createLessonPlan(userId, {
          childId,
          subjectId,
          topicId,
          plannedDate: "2026-09-28T10:00:00.000Z",
          plannedActivity: "Practice addition",
          plannedDurationMinutes: 30,
        }),
      ).rejects.toMatchObject({
        message:
          "You are not authorized to create a lesson plan for this child.",
        statusCode: 403,
      });

      expect(createSpy).not.toHaveBeenCalled();
    });
  });

  describe("getLessonPlans", () => {
    it("returns lesson plans for an authorized parent", async () => {
      vi.spyOn(ChildModel, "findOne").mockReturnValue({
        lean: vi.fn().mockResolvedValue(child),
      } as never);

      const plans = [
        {
          _id: new Types.ObjectId(),
          childId: new Types.ObjectId(childId),
          plannedDate: new Date("2026-09-28T10:00:00.000Z"),
          status: "PLANNED",
        },
      ];

      const sortSpy = vi.fn().mockReturnThis();

      vi.spyOn(LessonPlanModel, "find").mockReturnValue({
        sort: sortSpy,
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(plans),
      } as never);

      vi.spyOn(LessonPlanModel, "countDocuments").mockResolvedValue(1);

      const result = await getLessonPlans(userId, {
        childId,
      });

      expect(result.plans).toBe(plans);

      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it("rejects viewing plans for a child not owned by the parent", async () => {
      vi.spyOn(ChildModel, "findOne").mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as never);

      await expect(
        getLessonPlans(userId, {
          childId,
        }),
      ).rejects.toMatchObject({
        message: "You are not authorized to view lesson plans for this child.",
        statusCode: 403,
      });
    });

    it("applies status filtering", async () => {
      vi.spyOn(ChildModel, "findOne").mockReturnValue({
        lean: vi.fn().mockResolvedValue(child),
      } as never);

      const findSpy = vi.spyOn(LessonPlanModel, "find").mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(LessonPlanModel, "countDocuments").mockResolvedValue(0);

      await getLessonPlans(userId, {
        childId,
        status: "COMPLETED",
      });

      expect(findSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          childId: child._id,
          status: "COMPLETED",
        }),
      );
    });

    it("applies date range filtering and preserves ISO instants", async () => {
      vi.spyOn(ChildModel, "findOne").mockReturnValue({
        lean: vi.fn().mockResolvedValue(child),
      } as never);

      const findSpy = vi.spyOn(LessonPlanModel, "find").mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(LessonPlanModel, "countDocuments").mockResolvedValue(0);

      await getLessonPlans(userId, {
        childId,
        fromDate: "2026-10-02T18:30:00.000Z",
        toDate: "2026-10-03",
      });

      expect(findSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          childId: child._id,
          plannedDate: {
            $gte: new Date("2026-10-02T18:30:00.000Z"),
            $lte: new Date("2026-10-03T23:59:59.999Z"),
          },
        }),
      );
    });

    it("uses the default pagination values", async () => {
      vi.spyOn(ChildModel, "findOne").mockReturnValue({
        lean: vi.fn().mockResolvedValue(child),
      } as never);

      const skipSpy = vi.fn().mockReturnThis();
      const limitSpy = vi.fn().mockReturnThis();
      const leanSpy = vi.fn().mockResolvedValue([]);

      vi.spyOn(LessonPlanModel, "find").mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: skipSpy,
        limit: limitSpy,
        lean: leanSpy,
      } as never);

      vi.spyOn(LessonPlanModel, "countDocuments").mockResolvedValue(0);

      await getLessonPlans(userId, {
        childId,
      });

      expect(skipSpy).toHaveBeenCalledWith(0);
      expect(limitSpy).toHaveBeenCalledWith(20);
    });

    it("sorts lesson plans by planned date ascending", async () => {
      vi.spyOn(ChildModel, "findOne").mockReturnValue({
        lean: vi.fn().mockResolvedValue(child),
      } as never);

      const sortSpy = vi.fn().mockReturnThis();

      vi.spyOn(LessonPlanModel, "find").mockReturnValue({
        sort: sortSpy,
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(LessonPlanModel, "countDocuments").mockResolvedValue(0);

      await getLessonPlans(userId, {
        childId,
      });

      expect(sortSpy).toHaveBeenCalledWith({
        plannedDate: 1,
      });
    });
  });
});
