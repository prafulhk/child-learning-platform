import { Schema, model, Types } from "mongoose";

export interface Child {
  parentId: Types.ObjectId;
  name: string;
  dateOfBirth?: Date;
  grade?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const childSchema = new Schema<Child>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    dateOfBirth: {
      type: Date,
    },

    grade: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    avatar: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

export const ChildModel = model<Child>("Child", childSchema);
