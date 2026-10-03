import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { config } from "../../config/index.js";
import { UserModel } from "./models/user.model.js";
import { AppError } from "../../shared/errors/app-error.js";

import type { LoginInput } from "./schemas/login.schema.js";
import type { RegisterInput } from "./schemas/register.schema.js";

export async function registerParent(input: RegisterInput) {
  const existingUser = await UserModel.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new AppError({
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
      message: "An account with this email already exists",
    });
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

export async function loginUser(input: LoginInput) {
  const user = await UserModel.findOne({
    email: input.email,
  }).select("+passwordHash");

  if (!user) {
    throw new AppError({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}

export async function getUserById(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError({
      statusCode: 404,
      code: "USER_NOT_FOUND",
      message: "User not found",
    });
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
