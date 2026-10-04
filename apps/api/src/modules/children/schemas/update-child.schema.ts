import { z } from "zod";

export const updateChildSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .optional(),

    dateOfBirth: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date of birth")
      .optional(),

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
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateChildInput = z.infer<typeof updateChildSchema>;
