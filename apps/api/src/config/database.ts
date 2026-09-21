import mongoose from "mongoose";

import { config } from "./index.js";

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(config.MONGODB_URI);

  console.log("MongoDB connected successfully");
}
