import { Schema, model, Types } from "mongoose";

export interface LearningSession {
  childId: Types.ObjectId;
  subjectId: Types.ObjectId;
  topicId: Types.ObjectId;
  skillId?: Types.ObjectId;
  lessonPlanId?: Types.ObjectId;

  learningDate: Date;
  durationMinutes: number;

  whatWasTaught: string;

  performance: string;

  accuracy?: {
    correct: number;
    total: number;
    percentage: number;
  };

  notes?: string;

  createdByUserId: Types.ObjectId;
  createdByRole: "PARENT" | "TEACHER";

  createdAt: Date;
  updatedAt: Date;
}

const accuracySchema = new Schema(
  {
    correct: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { _id: false },
);

const learningSessionSchema = new Schema<LearningSession>(
  {
    childId: {
      type: Schema.Types.ObjectId,
      ref: "Child",
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

    lessonPlanId: {
      type: Schema.Types.ObjectId,
      ref: "LessonPlan",
    },

    learningDate: {
      type: Date,
      required: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    whatWasTaught: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

    performance: {
      type: String,
      required: true,
      trim: true,
    },

    accuracy: {
      type: accuracySchema,
    },

    notes: {
      type: String,
      trim: true,
    },

    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByRole: {
      type: String,
      enum: ["PARENT", "TEACHER"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

learningSessionSchema.index({
  childId: 1,
  learningDate: -1,
});

learningSessionSchema.index({
  childId: 1,
  subjectId: 1,
  learningDate: -1,
});

learningSessionSchema.index({
  childId: 1,
  topicId: 1,
  learningDate: -1,
});

learningSessionSchema.index({
  createdByUserId: 1,
  learningDate: -1,
});

export const LearningSessionModel = model<LearningSession>(
  "LearningSession",
  learningSessionSchema,
);
