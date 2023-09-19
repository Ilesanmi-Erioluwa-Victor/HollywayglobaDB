import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { Utils } from '../../../helper/utils';

import { authQuery } from './../models/user.auth.model';

import { Email } from '../../../templates';

const {
  findUserMEmail,
  registerM,
  forgetPasswordTokenM,
  accountVerificationUpdatedM,
  accountVerificationM,
  resetPasswordM,
  resetPasswordTokenDeleteM,
  resetPasswordUpdateM
} = authQuery;

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../../errors/customError';

import { createJwt } from '../../../utils';

import { ENV } from '../../../configurations/env';

const { catchAsync, comparePassword, generatePasswordResetToken } = Utils;

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
      const token = createJwt({ userId: user?.id, role: user?.role as string });
      const aDay = 1000 * 60 * 60 * 24;

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + aDay),
        secure: ENV.MODE.MODE === 'production',
      });
      res.json({
        status: 'success',
        message: 'you are logged in !',
      });
    } else {
      throw new UnauthenticatedError('invalid credentials, try agin');
    }
  }
);

export const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res
      .status(StatusCodes.OK)
      .json({ message: 'successfully logged out', status: 'success' });
  }
);

export const forgetPasswordToken: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await findUserMEmail(req.body.email);

    if (!user) throw new NotFoundError('no user found');

    const resetToken = generatePasswordResetToken();

    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const passwordReset = await forgetPasswordTokenM(
      await resetToken,
      expirationTime,
      user.id as string
    );

    await sendMailToken('user', passwordReset, req, res, next);
    res.json({
      message: `A reset token has been sent to your gmail`,
      status: 'success',
    });
  }
);

export const accountVerification: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.token) throw new NotFoundError('token not valid');

    const user = await accountVerificationM(
      req.params.id,
      req.params.token,
      new Date()
    );

    if (!user) throw new NotFoundError('no user found, try again');

    const updaterUser = await accountVerificationUpdatedM(
      user.id as string,
      true,
      '',
      null
    );

    res.json({
      status: 'success',
      message: 'you have successfully verify your account, log in now',
    });
  }
);

export const resetPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;

    if (!req.params.token) throw new NotFoundError('no token found, try again');

    const resetTokenData = await resetPasswordM(req.params.token);
    
      if (!resetTokenData || resetTokenData.expirationTime <= new Date()) 
        throw new BadRequestError('invalid or expired token, try again');
      

      const user = await resetPasswordUpdateM(
        resetTokenData?.user?.id as string,
        password
      );

      const deleteUserPasswordResetToken = await resetPasswordTokenDeleteM(
        resetTokenData?.id as string
      );

      res.json({
        message: 'Password reset successful, login now',
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
