/**
 * Represents a single row in a vertically stacked arithmetic expression.
 *
 * CRITICAL RULES:
 * 1. The first row has NO operator (undefined)
 * 2. Subsequent rows have operator '-' for subtraction, or undefined for addition
 * 3. Do NOT store '+'; addition is implicit
 * 4. A row with operator '-' means subtract that value
 * 5. A row without operator means add that value
 * 6. The renderer shows '-' only when operator === '-'
 * 7. Support 2, 3, or more rows
 */
export interface ArithmeticRow {
  /** The numeric value displayed in this row */
  value: number;

  /**
   * Optional operator for this row (subtraction only).
   * Undefined or omitted means addition (implicit).
   * Only '-' is explicitly stored.
   * First row must NOT have operator.
   */
  operator?: '-';
}

/**
 * A single answer option (value to be selected).
 */
export interface QuestionOption {
  id: string;
  value: number;
}

/**
 * Metadata describing where a question came from.
 * Optional so existing manual and seeded questions continue to work unchanged.
 */
export interface QuestionSourceMetadata {
  sourceType: 'MANUAL' | 'IMAGE' | 'PDF';
  originalFileName?: string;
  importedAt?: string;
}

/**
 * A single arithmetic question.
 *
 * CRITICAL MODEL RULES:
 *
 * 1. rows represent operands/terms displayed vertically (2, 3, or more)
 * 2. First row has NO operator
 * 3. Subsequent rows have operator '-' for subtraction, or undefined for addition
 * 4. Do NOT hardcode renderer around exactly two operands
 * 5. The '?' answer row is NOT stored in the model
 * 6. The mathematical answer is DERIVED by evaluating the expression
 * 7. Answer calculation: start with rows[0].value, then for each subsequent row:
 *    if row.operator === '-' → subtract row.value; otherwise → add row.value
 * 8. The derived answer is identified by matching correctOptionId
 * 9. This model remains reusable for future Exams and Assessment features
 * 10. subjectId and topicId are strings to allow flexibility
 */
export interface SimpleArithmeticQuestion {
  id: string;
  type: 'SIMPLE_ARITHMETIC';

  /** Subject identifier (seed value: 'abacus') */
  subjectId: string;

  /** Topic identifier (seed value: 'single-digit-addition') */
  topicId: string;

  /** Difficulty level */
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';

  /**
   * Ordered array of arithmetic rows.
   * Displayed vertically in order.
   * First row: value only, no operator.
   * Subsequent rows: value and optional operator.
   * Supports 2, 3, or more rows.
   */
  rows: ArithmeticRow[];

  /** Multiple-choice options (4 for Increment 1A) */
  options: QuestionOption[];

  /**
   * ID of the correct option (stable identifier).
   * DOES NOT change when options are shuffled.
   */
  correctOptionId: string;

  /** Optional explanation shown after submission */
  explanation?: string;

  /** Optional metadata describing how the question entered the bank */
  source?: QuestionSourceMetadata;

  /** ISO 8601 timestamp */
  createdAt: string;
}

/** Union type for future question types (NUMERIC, TRUE_FALSE, etc.) */
export type Question = SimpleArithmeticQuestion;
