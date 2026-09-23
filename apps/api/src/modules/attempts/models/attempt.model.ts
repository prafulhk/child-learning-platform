import { Schema, model, Types } from "mongoose";

const attemptResultSchema = new Schema(
  {
    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },
    correctCount: {
      type: Number,
      required: true,
      min: 0,
    },
    incorrectCount: {
      type: Number,
      required: true,
      min: 0,
    },
    unansweredCount: {
      type: Number,
      required: true,
      min: 0,
    },
    accuracyPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { _id: false },
);

const attemptSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    childId: {
      type: Types.ObjectId,
      ref: "Child",
      required: false,
      index: true,
    },

    attemptType: {
      type: String,
      enum: ["PRACTICE", "ASSESSMENT"],
      required: true,
      index: true,
    },

    clientAttemptId: {
      type: String,
      required: true,
    },

    topicId: {
      type: String,
      required: false,
    },

    assessmentId: {
      type: String,
      required: false,
    },

    title: {
      type: String,
      required: false,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    completedAt: {
      type: Date,
      required: true,
    },

    presentedQuestions: {
      type: [Schema.Types.Mixed],
      required: true,
      default: [],
    },

    selectedAnswers: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },

    flaggedQuestionIds: {
      type: [String],
      required: true,
      default: [],
    },

    result: {
      type: attemptResultSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

attemptSchema.index(
  {
    userId: 1,
    clientAttemptId: 1,
  },
  {
    unique: true,
  },
);

export const AttemptModel = model("Attempt", attemptSchema);
