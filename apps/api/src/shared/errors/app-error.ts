export interface AppErrorOptions {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  legacy?: Record<string, unknown>;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly legacy?: Record<string, unknown>;

  constructor(options: AppErrorOptions) {
    super(options.message);

    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.code = options.code;

    if (options.details !== undefined) {
      this.details = options.details;
    }

    if (options.legacy) {
      this.legacy = options.legacy;
    }
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
