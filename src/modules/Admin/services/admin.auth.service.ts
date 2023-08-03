import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import {
  catchAsync,
  ValidateMongoDbId,
  generateToken,
  createAccountVerificationTokenAdmin,
  generatePasswordResetToken,
} from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';
import { createAdminM } from '../models';

export const adminSignup: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name)
          return next(
            throwError(
              'Missing credentials, please provide all required information',
              StatusCodes.BAD_REQUEST
            )
            );
        const admin = await createAdminM(req.body)
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
