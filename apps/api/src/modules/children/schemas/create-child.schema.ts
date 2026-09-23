import { z } from "zod";

export const createChildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  dateOfBirth: z.string().optional(),

  grade: z
    .string()
    .trim()
    .max(50, "Grade must not exceed 50 characters")
    .optional(),

  avatar: z
    .string()
    .trim()
    .max(500, "Avatar URL must not exceed 500 characters")
    .optional(),
});

export type CreateChildInput = z.infer<typeof createChildSchema>;
