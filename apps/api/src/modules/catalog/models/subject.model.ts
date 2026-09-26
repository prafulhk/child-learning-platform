import { Schema, model } from "mongoose";

export interface Subject {
  name: string;
  code: string;
  description?: string;
  category: "ACADEMIC";
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<Subject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    category: {
      type: String,
      enum: ["ACADEMIC"],
      default: "ACADEMIC",
      required: true,
    },

    sortOrder: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

subjectSchema.index({ code: 1 }, { unique: true });

subjectSchema.index({ status: 1, sortOrder: 1 });

export const SubjectModel = model<Subject>("Subject", subjectSchema);
