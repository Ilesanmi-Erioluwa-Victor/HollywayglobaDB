import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { Utils } from '../../../helper/utils';

import { authQuery } from './../models/user.auth.model';

import { Email } from '../../../templates';

const { findUserMEmail, createUserM } = authQuery;

const { catchAsync, generateToken, comparePassword } = Utils;

const { sendMail, sendMailToken } = Email;

export const register: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await createUserM(req.body);
    sendMail('user', user, req, res, next);
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'account created',
    });
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
