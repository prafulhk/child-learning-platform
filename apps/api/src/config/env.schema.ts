import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z
    .union([z.string(), z.number(), z.undefined()])
    .transform((val) => {
      if (val === undefined || val === "") return undefined;
      const num = typeof val === "string" ? Number(val) : val;
      return num;
    })
    .refine(
      (val) =>
        val === undefined ||
        (Number.isInteger(val) && val >= 1 && val <= 65535),
      {
        message: "PORT must be an integer between 1 and 65535",
      },
    )
    .transform((val) => val ?? 3000),
});

export type Config = z.infer<typeof EnvSchema>;
