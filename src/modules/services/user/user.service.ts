import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import {
  CustomRequest,
  signupUser,
  loginUser,
} from '../../../interfaces/custom';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { prisma } from '../../../configurations/db';
import {
  generatePasswordResetToken,
  createAccountVerificationToken,
  generateToken,
  catchAsync,
  ValidateMongoDbId,
} from '../../../helper/utils';
import { sendMail, sendUserToken } from '../../../templates/sendMail';

export const create_user: RequestHandler = catchAsync(
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

      const exist_user = await prisma.user.findUnique({ where: { email } });
      if (exist_user) {
        return next(
          throwError(
            'You are already a member, kindly login to your account',
            StatusCodes.CONFLICT
          )
        );
      }
      // TODO  i will write it to it logic util later
      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const user: signupUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          mobile,
        },
      });
      generateToken(user?.id as string);
      const tokenUser = await createAccountVerificationToken(user?.id);
      await sendMail(tokenUser, req, res, next);

      res.status(StatusCodes.CREATED).json({
        message: 'You have successfully created your account, log in now',
        status: 'success',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
