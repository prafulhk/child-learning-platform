export interface ApiSuccessResponse<TData> {
  success: true;
  message?: string;
  data: TData;
}

export type ApiSuccessWithLegacy<TData, TLegacy extends object> = ApiSuccessResponse<TData> &
  TLegacy;

export interface ApiErrorResponse<TDetails = unknown> {
  success: false;
  message: string;
  error: {
    code: string;
    details?: TDetails;
  };
}
