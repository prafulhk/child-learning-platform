import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const getTopicsSchema = z.object({
  subjectId: objectIdSchema,
});

export type GetTopicsInput = z.infer<typeof getTopicsSchema>;
