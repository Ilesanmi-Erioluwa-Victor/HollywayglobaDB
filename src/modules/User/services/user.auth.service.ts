import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import {
  catchAsync,
  ValidateMongoDbId,
  generateToken,
  createAccountVerificationToken,
  generatePasswordResetToken,
} from '../../../helper/utils';
import { findUserM, createUserM } from '../models';
import { sendMail } from '../../../templates/sendMail';

export const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, password, email, mobile } = req.body;
      if (!firstName || !lastName || !password || !email || !mobile)
        return next(
          throwError(
            'Missing credentials, please provide all required information',
            StatusCodes.BAD_REQUEST
          )
        );

      const existEmail = await findUserM(email);
      if (existEmail)
        next(
          throwError(
            'You are already a member, kindly login to your account',
            StatusCodes.CONFLICT
          )
        );

      const user = await createUserM(req.body);
      sendMail(user, req, res, next);
    } catch (error) {}
  }
);
