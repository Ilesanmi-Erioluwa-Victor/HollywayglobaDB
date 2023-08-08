import { Request, Response, NextFunction } from 'express';

class ErrorHandlerMiddleware {
  static notFound(req: Request, res: Response, next: NextFunction): void {
    const error = new Error(`Not found ${req?.originalUrl}`);
    res.status(404);
    next(error);
  }

  static errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err?.message,
      stack: err?.stack,
    });
  }
}

export default ErrorHandlerMiddleware;
