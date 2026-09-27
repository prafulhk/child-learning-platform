import { Schema, model, Types } from "mongoose";

export type LessonPlanStatus = "PLANNED" | "COMPLETED" | "CANCELLED";

export interface LessonPlan {
  childId: Types.ObjectId;
  plannedDate: Date;

  subjectId: Types.ObjectId;
  topicId: Types.ObjectId;
  skillId?: Types.ObjectId;

  plannedActivity: string;
  plannedDurationMinutes: number;

  notes?: string;

  status: LessonPlanStatus;

  completedLearningSessionId?: Types.ObjectId;

  createdByUserId: Types.ObjectId;
  createdByRole: "PARENT";

  createdAt: Date;
  updatedAt: Date;
}

const lessonPlanSchema = new Schema<LessonPlan>(
  {
    childId: {
      type: Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },

    plannedDate: {
      type: Date,
      required: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    skillId: {
      type: Schema.Types.ObjectId,
      ref: "Skill",
    },

    plannedActivity: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

    plannedDurationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PLANNED", "COMPLETED", "CANCELLED"],
      required: true,
      default: "PLANNED",
    },

    completedLearningSessionId: {
      type: Schema.Types.ObjectId,
      ref: "LearningSession",
    },

    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByRole: {
      type: String,
      enum: ["PARENT"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

lessonPlanSchema.index({
  childId: 1,
  plannedDate: 1,
});

lessonPlanSchema.index({
  childId: 1,
  status: 1,
  plannedDate: 1,
});

export const LessonPlanModel = model<LessonPlan>(
  "LessonPlan",
  lessonPlanSchema,
);
