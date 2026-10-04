import { Types } from "mongoose";

import { ChildModel } from "./models/child.model.js";
import type { CreateChildInput } from "./schemas/create-child.schema.js";
import type { UpdateChildInput } from "./schemas/update-child.schema.js";
import { AppError } from "../../shared/errors/app-error.js";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createChild(parentId: string, input: CreateChildInput) {
  const existingChild = await ChildModel.findOne({
    parentId,
    name: {
      $regex: `^${escapeRegExp(input.name.trim())}$`,
      $options: "i",
    },
  });

  if (existingChild) {
    throw new AppError({
      statusCode: 409,
      code: "CHILD_CONFLICT",
      message: "A child with this name already exists.",
    });
  }

  const childData = {
    parentId,
    name: input.name,
    ...(input.dateOfBirth ? { dateOfBirth: new Date(input.dateOfBirth) } : {}),
    ...(input.grade ? { grade: input.grade } : {}),
    ...(input.avatar ? { avatar: input.avatar } : {}),
  };

  const child = await ChildModel.create(childData);

  return child;
}

export async function getChildrenByParent(parentId: string) {
  const children = await ChildModel.find({ parentId })
    .sort({ createdAt: -1 })
    .lean();

  return children;
}

export async function updateChild(
  parentId: string,
  childId: string,
  input: UpdateChildInput,
) {
  if (!Types.ObjectId.isValid(childId)) {
    throw new AppError({
      statusCode: 404,
      code: "CHILD_NOT_FOUND",
      message: "Child not found.",
    });
  }

  const child = await ChildModel.findOne({ _id: childId, parentId });

  if (!child) {
    throw new AppError({
      statusCode: 404,
      code: "CHILD_NOT_FOUND",
      message: "Child not found.",
    });
  }

  if (input.name && input.name.trim().toLowerCase() !== child.name.trim().toLowerCase()) {
    const duplicateChild = await ChildModel.findOne({
      _id: { $ne: child._id },
      parentId,
      name: {
        $regex: `^${escapeRegExp(input.name.trim())}$`,
        $options: "i",
      },
    });

    if (duplicateChild) {
      throw new AppError({
        statusCode: 409,
        code: "CHILD_CONFLICT",
        message: "A child with this name already exists.",
      });
    }
  }

  if (input.name !== undefined) child.name = input.name;
  if (input.dateOfBirth !== undefined) child.dateOfBirth = new Date(input.dateOfBirth);
  if (input.grade !== undefined) child.grade = input.grade;
  if (input.avatar !== undefined) child.avatar = input.avatar;

  await child.save();

  return child;
}
