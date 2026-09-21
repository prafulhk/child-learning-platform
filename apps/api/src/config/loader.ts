import dotenv from "dotenv";
import { EnvSchema } from "./env.schema.js";

dotenv.config();

function buildRawEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  };
}

export function loadConfig() {
  const raw = buildRawEnv();

  const parsed = EnvSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(
      (i) => `${i.path.join(".")} - ${i.message}`,
    );
    throw new Error(`Invalid configuration: ${issues.join("; ")}`);
  }

  return parsed.data;
}
