import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { Utils } from '../../../helper/utils';

import { userQueries } from '../user.auth.model';

import { Email } from '../../../templates';

const { findUserMEmail, createUserM } = userQueries;

const { catchAsync, generateToken, comparePassword } = Utils;

const { sendMail, sendMailToken } = Email;

export const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existEmail = await findUserMEmail(req.body.email);
      if (existEmail) {
        throwError(
          'You are already a member, kindly login to your account',
          StatusCodes.CONFLICT
        );
      }

      const user: any = await createUserM(req.body);
      sendMail('user', user, req, res, next);
      res.json({
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

      if (!user) {
        throwError('No user found with this email', StatusCodes.BAD_REQUEST);
      }

      if (await comparePassword(password, user?.password)) {
        if (!user.isAccountVerified) {
          throwError(
            'Verify your account in your gmail before you can log in',
            StatusCodes.BAD_REQUEST
          );
        }

        res.json({
          status: 'success',
          message: 'login successfully',
          data: {
            id: user?.id,
            token: await generateToken(user?.id),
          },
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
