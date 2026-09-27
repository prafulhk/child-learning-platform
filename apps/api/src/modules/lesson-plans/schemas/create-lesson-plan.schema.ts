import { z } from "zod";

export const createLessonPlanSchema = z.object({
  childId: z.string().regex(/^[a-f\d]{24}$/i),

  plannedDate: z.string().datetime(),

  subjectId: z.string().regex(/^[a-f\d]{24}$/i),

  topicId: z.string().regex(/^[a-f\d]{24}$/i),

  skillId: z
    .string()
    .regex(/^[a-f\d]{24}$/i)
    .optional(),

  plannedActivity: z.string().trim().min(1),

  plannedDurationMinutes: z.number().int().min(0),

  notes: z.string().trim().optional(),
});

export type CreateLessonPlanInput = z.infer<typeof createLessonPlanSchema>;
