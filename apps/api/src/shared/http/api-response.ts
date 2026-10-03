import type { Response } from "express";

type LegacyResponseFields = Record<string, unknown>;

export interface ApiSuccessResponse<TData> {
  success: true;
  message?: string;
  data: TData;
}

export interface ApiErrorResponse<TDetails = unknown> {
  success: false;
  message: string;
  error: {
    code: string;
    details?: TDetails;
  };
}

interface SendSuccessOptions<
  TData,
  TLegacy extends LegacyResponseFields = LegacyResponseFields,
> {
  res: Response;
  statusCode: number;
  data: TData;
  message?: string;
  legacy?: TLegacy;
}

interface SendErrorOptions<
  TDetails = unknown,
  TLegacy extends LegacyResponseFields = LegacyResponseFields,
> {
  res: Response;
  statusCode: number;
  message: string;
  code: string;
  details?: TDetails;
  legacy?: TLegacy;
}

export function sendSuccess<
  TData,
  TLegacy extends LegacyResponseFields = LegacyResponseFields,
>({
  res,
  statusCode,
  data,
  message,
  legacy,
}: SendSuccessOptions<TData, TLegacy>): void {
  const payload: ApiSuccessResponse<TData> & LegacyResponseFields = {
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(legacy ?? {}),
  };

  res.status(statusCode).json(payload);
}

export function sendError<
  TDetails = unknown,
  TLegacy extends LegacyResponseFields = LegacyResponseFields,
>({
  res,
  statusCode,
  message,
  code,
  details,
  legacy,
}: SendErrorOptions<TDetails, TLegacy>): void {
  const payload: ApiErrorResponse<TDetails> & LegacyResponseFields = {
    success: false,
    message,
    error: {
      code,
      ...(details !== undefined ? { details } : {}),
    },
    ...(legacy ?? {}),
  };

  res.status(statusCode).json(payload);
}
