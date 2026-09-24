import { z } from "zod";

const objectIdSchema = z
  .string()
  .min(1, "ID is required")
  .refine((value) => /^[a-f\d]{24}$/i.test(value), {
    message: "Invalid ID",
  });

const accuracySchema = z
  .object({
    correct: z.number().int().min(0),
    total: z.number().int().min(0),
    percentage: z.number().min(0).max(100),
  })
  .refine((value) => value.correct <= value.total, {
    message: "Correct count cannot exceed total",
    path: ["correct"],
  });

export const createLearningSessionSchema = z.object({
  childId: objectIdSchema,

  subjectId: objectIdSchema,

  topicId: objectIdSchema,

  skillId: objectIdSchema.optional(),

  lessonPlanId: objectIdSchema.optional(),

  learningDate: z.string().datetime(),

  durationMinutes: z.number().int().min(0),

  whatWasTaught: z.string().trim().min(1, "What was taught is required"),

  performance: z.string().trim().min(1, "Performance is required"),

  accuracy: accuracySchema.optional(),

  notes: z.string().trim().optional(),
});

export type CreateLearningSessionInput = z.infer<
  typeof createLearningSessionSchema
>;
