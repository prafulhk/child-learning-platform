import type { SimpleArithmeticQuestion } from './question.model';

export type AssessmentSelectionMode = 'RANDOM' | 'FIXED';

export interface AssessmentConfig {
  questionCount: number;
  durationSeconds: number;
  selectionMode: AssessmentSelectionMode;
}

export interface AssessmentDefinition {
  id: string;
  title: string;
  subjectId: string;
  topicId: string;
  config: AssessmentConfig;
  questionIds?: string[];
}

export interface AssessmentQuestionSnapshot {
  questionId: string;
  questionSnapshot: SimpleArithmeticQuestion;
}

export interface ActiveAssessmentSession {
  assessmentId: string;
  startedAt: string;
  endsAt: string;
  currentQuestionIndex: number;
  questions: AssessmentQuestionSnapshot[];
  selectedAnswers: Record<string, string>;
  flaggedQuestionIds: string[];
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  startedAt: string;
  completedAt: string;
  questions: AssessmentQuestionSnapshot[];
  selectedAnswers: Record<string, string>;
  flaggedQuestionIds: string[];
  result: {
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    accuracyPercentage: number;
  };
}

export const OLYMPIAD_ASSESSMENT_CONFIG: AssessmentConfig = {
  questionCount: 100,
  durationSeconds: 15 * 60,
  selectionMode: 'RANDOM',
};
