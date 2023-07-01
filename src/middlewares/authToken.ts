import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { Error } from '../types/requestErrorType';
import { throwError } from './cacheError';

export default (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throwError('No token provided', 401);
    }
    let decode: any;
    const token = authHeader?.split(' ')[1];
    decode = Jwt.verify(token, `${process.env.JWT_SECRET}`);

    if (!token || !decode) {
      throwError('Invalid token', 401);
    }
    req.id = decode?.id;
    next();
  } catch (error) {
    const errorResponse: Error = new Error('Not authorized');
    errorResponse.statusCode = 401;
    next(errorResponse);
  }
};
