import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils';

export class _404 {
  static notFound(req: Request, res: Response, next: NextFunction) {
     next(new AppError(`Can't find ${req.originalUrl}, ensure you have the correct URL`, 404));
  }
}
