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

    if (!admin) throw new BadRequestError('something went wrong, try again');

    sendMail('admin', admin, req, res, next);
    res.json({
      message: 'you have successfully created your account, log in now',
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

// export const forgetPasswordToken: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user = await findUserMEmail(req.body.email);

//     if (!user) throw new NotFoundError('no user found');

//     const resetToken = generatePasswordResetToken();

//     const expirationTime = new Date();
//     expirationTime.setHours(expirationTime.getHours() + 1);

//     const passwordReset = await forgetPasswordTokenM(
//       await resetToken,
//       expirationTime,
//       user.id as string
//     );

//     await sendMailToken('user', passwordReset, req, res, next);
//     res.json({
//       message: `A reset token has been sent to your gmail`,
//       status: 'success',
//     });
//   }
// );

// export const accountVerification: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.params.token) throw new NotFoundError('token not valid');

//     const user = await accountVerificationM(
//       req.params.id,
//       req.params.token,
//       new Date()
//     );

//     if (!user) throw new NotFoundError('no user found, try again');

//     const updaterUser = await accountVerificationUpdatedM(
//       user.id as string,
//       true,
//       '',
//       null
//     );

//     res.json({
//       status: 'success',
//       message: 'you have successfully verify your account, log in now',
//     });
//   }
// );

// export const resetPassword: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { password } = req.body;

//     if (!req.params.token) throw new NotFoundError('no token found, try again');

//     const resetTokenData = await resetPasswordM(req.params.token);

//     if (!resetTokenData || resetTokenData.expirationTime <= new Date())
//       throw new BadRequestError('invalid or expired token, try again');

//     const user = await resetPasswordUpdateM(
//       resetTokenData.user.id as string,
//       password
//     );

//     const deleteUserPasswordResetToken = await resetPasswordTokenDeleteM(
//       resetTokenData.id as string
//     );

//     res.json({
//       message: 'password reset successful, login now',
//       status: 'success',
//     });
//   }
// );
