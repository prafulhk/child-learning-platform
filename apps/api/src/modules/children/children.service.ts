import { ChildModel } from "./models/child.model.js";
import type { CreateChildInput } from "./schemas/create-child.schema.js";
import { AppError } from "../../shared/errors/app-error.js";

export async function createChild(parentId: string, input: CreateChildInput) {
  const existingChild = await ChildModel.findOne({
    parentId,
    name: {
      $regex: `^${input.name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
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
