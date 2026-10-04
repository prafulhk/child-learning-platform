import { z } from "zod";

export const updateSubjectSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    code: z.string().trim().min(1).max(50).optional(),
    description: z.string().trim().max(500).optional(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
