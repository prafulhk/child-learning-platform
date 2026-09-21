import { Schema, model } from "mongoose";

export type UserRole = "PARENT" | "TEACHER";

export interface User {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["PARENT", "TEACHER"],
      default: "PARENT",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<User>("User", userSchema);
