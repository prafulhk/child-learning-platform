import { z } from "zod";

export const updateSubjectStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type UpdateSubjectStatusInput = z.infer<typeof updateSubjectStatusSchema>;
