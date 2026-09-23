import { ChildModel } from "./models/child.model.js";
import type { CreateChildInput } from "./schemas/create-child.schema.js";

export async function createChild(parentId: string, input: CreateChildInput) {
  const existingChild = await ChildModel.findOne({
    parentId,
    name: {
      $regex: `^${input.name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
  });

  if (existingChild) {
    const error = new Error("A child with this name already exists.");

    (error as Error & { statusCode?: number }).statusCode = 409;

    throw error;
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
