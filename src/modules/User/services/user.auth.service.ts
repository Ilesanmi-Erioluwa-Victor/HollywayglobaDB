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
import { CustomRequest } from '../../../interfaces/custom';
import {
  findUserMEmail,
  createUserM,
  findUserMId,
  updateUserM,
} from '../models';
import { sendMail } from '../../../templates/sendMail';
import { loginUserI } from '../user.interface';

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

      const existEmail = await findUserMEmail(email);
      if (existEmail)
        next(
          throwError(
            'You are already a member, kindly login to your account',
            StatusCodes.CONFLICT
          )
        );

      const user = await createUserM(req.body);
      sendMail(user, req, res, next);
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

export const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user: loginUserI | any = await findUserMEmail(email);

      if (!user)
        next(
          throwError('No user found with this email', StatusCodes.BAD_REQUEST)
        );
      if (await bcrypt.compare(password, user?.password)) {
        if (!user.isAccountVerified) {
          throwError(
            'Verify your account in your gmail before you can log in',
            StatusCodes.BAD_REQUEST
          );
        }

        res.json({
          id: user?.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePhoto: user.profilePhoto,
          token: generateToken(user?.id),
        });
      } else {
        throwError(
          'Login Failed, invalid credentials',
          StatusCodes.UNAUTHORIZED
        );
      }
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const getUser: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    try {
      const user = await findUserMId(id);
      res.json(user);
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const updateUser = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);

    const allowedFields = ['firstName', 'lastName', 'email'];
    const unexpectedFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );
    if (unexpectedFields.length > 0) {
      throwError(
        `Unexpected fields: ${unexpectedFields.join(
          ', '
        )}, Sorry it's not part of the parameter`,
        StatusCodes.BAD_REQUEST
      );
    }
    try {
      const user = await updateUserM(
        id,
        req.body.firstName,
        req.body.lastName,
        req.body.email
      );
      res.json({
        message: 'You have successfully updated your profile',
        user: user,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const update_password = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req?.params;
      const { password } = req.body;
    try {
      ValidateMongoDbId(id);
      if (!password)
        throwError(
          'Please, provide password before you can change your current password',
          StatusCodes.BAD_REQUEST
        );
         
      if (password) {
        res.json({
          message: 'You have successfully update your password',
        });
      }
      // TODO still have a bug to fix, which, when user don't provide password, use the initial one
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
