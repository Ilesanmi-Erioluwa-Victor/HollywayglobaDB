import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { Utils } from '../../../helper/utils';

import { Email } from '../../../templates';

import { createJwt } from '../../../utils';

import { ENV } from '../../../configurations/env';

import { prisma } from '../../../configurations/db';

import { adminQuery } from '../models/admin.models';

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../../../errors/customError';

// import bcrypt from 'bcryptjs';

// import { loginAdminI } from '../interfaces/admin.interface';

const {
  accountVerificationAdminM,
  accountVerificationUpdatedAdminM,
  createAdminM,
  findAdminEmailM,
  getUsersAdminM,
} = adminQuery;

const { sendMail, sendMailToken } = Email;

const { catchAsync, comparePassword } = Utils;

export const adminSignup: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = await createAdminM(req.body);

    sendMail('admin', admin, req, res, next);
    res.json({
      message: 'You have successfully created your account, log in now',
      status: 'success',
    });
  }
);

export const loginAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = await findAdminEmailM(req.body.email);

    if (!admin) throw new NotFoundError('no user found ...');

    if (await comparePassword(req.body.password, admin.password)) {
      if (!admin.isAccountVerified) {
        throw new BadRequestError(
          'verify your account in your gmail before you can log in'
        );
      }
      const token = createJwt({
        userId: admin?.id,
        role: admin?.role as string,
      });
      const aDay = 1000 * 60 * 60 * 24;

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + aDay),
        secure: ENV.MODE.MODE === 'production',
      });
      console.log(token, admin);
    } else {
      throw new UnauthorizedError('login failed, invalid credentials');
    }
  }
);

export const logoutAdmin: RequestHandler = catchAsync(
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

export const accountVerificationAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.token) throw new NotFoundError('token not valid');

    const admin = await accountVerificationAdminM(
      req.params.adminId,
      req.params.token,
      new Date()
    );

    if (!admin) throw new BadRequestError('no user found ...');

    const updatedAdmin = await accountVerificationUpdatedAdminM(
      admin.id as string,
      true,
      '',
      null
    );
    res.json({
      status: 'success',
      message: 'you have successfully, verify your account, log in now',
    });
  }
);
