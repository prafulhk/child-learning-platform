import type { ErrorRequestHandler, RequestHandler } from "express";

import { sendError } from "../shared/http/api-response.js";
import { AppError, isAppError } from "../shared/errors/app-error.js";

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(
    new AppError({
      statusCode: 404,
      code: "NOT_FOUND",
      message: "Resource not found",
    }),
  );
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const normalizedError = normalizeError(error);

  if (normalizedError.statusCode >= 500) {
    logUnexpectedError(req.method, req.originalUrl, error);
  }

  const errorOptions = {
    res,
    statusCode: normalizedError.statusCode,
    message: normalizedError.message,
    code: normalizedError.code,
    ...(normalizedError.details !== undefined
      ? { details: normalizedError.details }
      : {}),
    ...(normalizedError.legacy ? { legacy: normalizedError.legacy } : {}),
  };

  sendError(errorOptions);
};

function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof SyntaxError) {
    return new AppError({
      statusCode: 400,
      code: "INVALID_JSON",
      message: "Invalid JSON payload",
    });
  }

  return new AppError({
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}

function logUnexpectedError(
  method: string,
  path: string,
  error: unknown,
): void {
  if (error instanceof Error) {
    console.error("Unexpected API error", {
      method,
      path,
      name: error.name,
    });

    return;
  }

  console.error("Unexpected API error", {
    method,
    path,
  });
}
