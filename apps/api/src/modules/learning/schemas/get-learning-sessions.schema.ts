import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const getLearningSessionsSchema = z.object({
  childId: objectIdSchema,
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
  subjectId: objectIdSchema.optional(),
  topicId: objectIdSchema.optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type GetLearningSessionsInput = z.infer<
  typeof getLearningSessionsSchema
>;
