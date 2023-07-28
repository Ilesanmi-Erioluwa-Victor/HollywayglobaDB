import { Error } from '../../interfaces/requestErrorInterface';

export const throwError = (errorMsg: string, statusCode: number): Error => {
  const error: any = new Error(errorMsg);
  error.statusCode = statusCode;
  Error.captureStackTrace(error, throwError);
  throw error;
};
