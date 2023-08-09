import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils';
import { ENV } from '../../configurations/config';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
}

class ErrorHandlerMiddleware {

  static handleCastErrorDB(err: any): AppError {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
  }

  static handleValidationErrorDB(err: any): AppError {
    const errors = Object.values(err.errors).map((el: any) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  }

  static handleJWTError(): AppError {
    return new AppError('Invalid token. Please log in again!', 401);
  }

  static handleJWTExpiredError(): AppError {
    return new AppError('Your token has expired! Please log in again.', 401);
  }


  static sendErrorDev(err: AppError, res: Response): void {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  static sendErrorProd(err: AppError, res: Response): void {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error('ERROR 💥', err);

      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }

  static errorHandler(
    err: ErrorWithStatusCode,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (ENV.MODE.DEVELOPMENT === 'development') {

      ErrorHandlerMiddleware.sendErrorDev(err as AppError, res);

    
    }

    else if (ENV.MODE.PRODUCTION === 'production') {
      let error = { ...err };

      if (error.name === 'CastError')
        error = ErrorHandlerMiddleware.handleCastErrorDB(error);
      if (error.name === 'ValidationError')
        error = ErrorHandlerMiddleware.handleValidationErrorDB(error);
      if (error.name === 'JsonWebTokenError')
        error = ErrorHandlerMiddleware.handleJWTError();
      if (error.name === 'TokenExpiredError')
        error = ErrorHandlerMiddleware.handleJWTExpiredError();

      ErrorHandlerMiddleware.sendErrorProd(error as AppError, res);
    }
  }
}

export default ErrorHandlerMiddleware;
