import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { Utils } from '../../../helper/utils';

import { authQuery } from './../models/user.auth.model';

import { Email } from '../../../templates';

const { findUserMEmail, registerM } = authQuery;

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../errors/customError';

const { catchAsync, generateToken, comparePassword } = Utils;

const { sendMail, sendMailToken } = Email;

export const register: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await registerM(req.body);
    sendMail('user', user, req, res, next);
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'account created',
    });
  }
);

export const login: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await findUserMEmail(req.body.email);

    if (!user) throw new NotFoundError('no account found');

    if (await comparePassword(req.body.password, user?.password)) {
      if (!user.isAccountVerified) {
        throw new BadRequestError(
          'verify your account in your gmail before you can log in'
        );
      }
      res.json({
        status: 'success',
        message: 'user logged in',
      });
    } else {
      throw new UnauthenticatedError('invalid credentials, try agin');
    }
  }
);
