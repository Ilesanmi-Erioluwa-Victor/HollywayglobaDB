class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  Error_name: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.Error_name = Error.constructor().name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
