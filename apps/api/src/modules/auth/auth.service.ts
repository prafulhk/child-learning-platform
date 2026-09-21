import bcrypt from "bcryptjs";

import { UserModel } from "./models/user.model.js";
import type { RegisterInput } from "./schemas/register.schema.js";

export async function registerParent(input: RegisterInput) {
  const existingUser = await UserModel.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "PARENT",
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
