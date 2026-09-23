import { z } from "zod";

const attemptResultSchema = z.object({
  totalQuestions: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  incorrectCount: z.number().int().min(0),
  unansweredCount: z.number().int().min(0),
  accuracyPercentage: z.number().min(0).max(100),
});

export const createAttemptSchema = z.object({
  clientAttemptId: z.string().min(1),

  attemptType: z.enum(["PRACTICE", "ASSESSMENT"]),

  childId: z.string().optional(),

  topicId: z.string().optional(),

  assessmentId: z.string().optional(),

  title: z.string().optional(),

  startedAt: z.string().datetime(),

  completedAt: z.string().datetime(),

  presentedQuestions: z.array(z.unknown()),

  selectedAnswers: z.record(z.string(), z.string()),

  flaggedQuestionIds: z.array(z.string()).default([]),

  result: attemptResultSchema,
});

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>;
