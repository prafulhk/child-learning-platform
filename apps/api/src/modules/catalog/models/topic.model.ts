import { Schema, model, Types } from "mongoose";

export interface Topic {
  subjectId: Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<Topic>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

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

topicSchema.index({ subjectId: 1, code: 1 }, { unique: true });

topicSchema.index({ subjectId: 1, status: 1 });

export const TopicModel = model<Topic>("Topic", topicSchema);
