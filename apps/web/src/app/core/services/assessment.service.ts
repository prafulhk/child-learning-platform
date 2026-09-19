import { Injectable } from '@angular/core';

import type {
  ActiveAssessmentSession,
  AssessmentDefinition,
  AssessmentQuestionSnapshot,
} from '../models/assessment.model';
import type { SimpleArithmeticQuestion } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  createSession(
    definition: AssessmentDefinition,
    questionPool: SimpleArithmeticQuestion[],
    startedAt: string = new Date().toISOString(),
  ): ActiveAssessmentSession {
    this.validateDefinition(definition);

    const selectedQuestions = this.selectQuestions(definition, questionPool);

    const startsAtMs = new Date(startedAt).getTime();

    if (Number.isNaN(startsAtMs)) {
      throw new Error('Invalid assessment start time.');
    }

    const endsAt = new Date(startsAtMs + definition.config.durationSeconds * 1000).toISOString();

    const questions: AssessmentQuestionSnapshot[] = selectedQuestions.map((question) => ({
      questionId: question.id,
      questionSnapshot: this.cloneQuestion(question),
    }));

    return {
      assessmentId: definition.id,
      startedAt,
      endsAt,
      currentQuestionIndex: 0,
      questions,
      selectedAnswers: {},
      flaggedQuestionIds: [],
    };
  }

  private selectQuestions(
    definition: AssessmentDefinition,
    questionPool: SimpleArithmeticQuestion[],
  ): SimpleArithmeticQuestion[] {
    const uniqueQuestions = this.getUniqueQuestions(questionPool);

    if (uniqueQuestions.length < definition.config.questionCount) {
      throw new Error(
        `Not enough unique questions. Required ${definition.config.questionCount}, available ${uniqueQuestions.length}.`,
      );
    }

    if (definition.config.selectionMode === 'FIXED') {
      return this.selectFixedQuestions(definition, uniqueQuestions);
    }

    return this.shuffle(uniqueQuestions).slice(0, definition.config.questionCount);
  }

  private selectFixedQuestions(
    definition: AssessmentDefinition,
    questionPool: SimpleArithmeticQuestion[],
  ): SimpleArithmeticQuestion[] {
    const fixedQuestionIds = definition.questionIds ?? [];

    if (fixedQuestionIds.length !== definition.config.questionCount) {
      throw new Error('Fixed assessment questionIds must match questionCount.');
    }

    const questionMap = new Map(questionPool.map((question) => [question.id, question]));

    const selectedQuestions = fixedQuestionIds.map((questionId) => questionMap.get(questionId));

    if (selectedQuestions.some((question) => question === undefined)) {
      throw new Error('The fixed assessment contains question IDs that are not available.');
    }

    const uniqueIds = new Set(fixedQuestionIds);

    if (uniqueIds.size !== fixedQuestionIds.length) {
      throw new Error('A fixed assessment cannot contain duplicate question IDs.');
    }

    return selectedQuestions.filter(
      (question): question is SimpleArithmeticQuestion => question !== undefined,
    );
  }

  private getUniqueQuestions(questionPool: SimpleArithmeticQuestion[]): SimpleArithmeticQuestion[] {
    const uniqueQuestions = new Map<string, SimpleArithmeticQuestion>();

    for (const question of questionPool) {
      if (!uniqueQuestions.has(question.id)) {
        uniqueQuestions.set(question.id, question);
      }
    }

    return [...uniqueQuestions.values()];
  }

  private shuffle(questions: SimpleArithmeticQuestion[]): SimpleArithmeticQuestion[] {
    const result = [...questions];

    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }

    return result;
  }

  private cloneQuestion(question: SimpleArithmeticQuestion): SimpleArithmeticQuestion {
    return {
      ...question,
      rows: question.rows.map((row) => ({
        ...row,
      })),
      options: question.options.map((option) => ({
        ...option,
      })),
    };
  }

  private validateDefinition(definition: AssessmentDefinition): void {
    if (definition.config.questionCount <= 0) {
      throw new Error('Assessment questionCount must be greater than 0.');
    }

    if (definition.config.durationSeconds <= 0) {
      throw new Error('Assessment durationSeconds must be greater than 0.');
    }

    if (definition.config.selectionMode === 'FIXED') {
      if (!definition.questionIds?.length) {
        throw new Error('Fixed assessments require questionIds.');
      }
    }
  }
}
