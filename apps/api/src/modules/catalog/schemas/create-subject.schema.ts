import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z.string().trim().min(1).max(50),
  description: z.string().trim().max(500).optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
