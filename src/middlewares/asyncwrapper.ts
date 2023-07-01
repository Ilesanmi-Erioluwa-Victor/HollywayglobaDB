import { RequestHandler } from 'express';

export const asyncWrapper: RequestHandler = async (fn: any) => {
  return async (req: any, res: any, next: any) => {
    try {
      await fn(req, res);
    } catch (error) {
      next(error);
    }
  };
};
