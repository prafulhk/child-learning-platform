import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { QUESTIONS_SEED } from '../../data/questions.seed';

/**
 * QuestionService provides access to the Question Bank.
 *
 * Responsibilities:
 * - Load and provide seeded questions
 * - Filter questions by topic
 * - Select random unique questions
 * - Do NOT mutate seed data
 * - Do NOT shuffle options (that's PracticeService responsibility)
 */
@Injectable({ providedIn: 'root' })
export class QuestionService {
  constructor() {}

  /**
   * Get all questions from the Question Bank.
   * Returns a fresh copy to prevent mutations.
   */
  getAllQuestions(): Question[] {
    return JSON.parse(JSON.stringify(QUESTIONS_SEED));
  }

  /**
   * Get all questions matching a specific topic.
   * @param topicId Topic identifier (e.g., 'single-digit-addition')
   * @returns Filtered questions for the topic
   */
  getQuestionsByTopic(topicId: string): Question[] {
    return this.getAllQuestions().filter((q) => q.topicId === topicId);
  }

  /**
   * Get N random unique questions from the Question Bank.
   * Returns a deep copy to prevent mutations.
   *
   * @param count Number of questions to select
   * @param topicId Optional topic filter. If not provided, selects from all questions.
   * @returns Array of random unique questions
   * @throws Error if count exceeds available questions
   */
  getRandomQuestions(count: number, topicId?: string): Question[] {
    const source = topicId ? this.getQuestionsByTopic(topicId) : this.getAllQuestions();

    if (count > source.length) {
      throw new Error(
        `Cannot select ${count} unique questions from ${source.length} available questions.`,
      );
    }

    // Fisher-Yates shuffle
    const shuffled = [...source];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return the first `count` items
    const selected = shuffled.slice(0, count);

    // Return deep copies to prevent external mutations
    return JSON.parse(JSON.stringify(selected));
  }
}
