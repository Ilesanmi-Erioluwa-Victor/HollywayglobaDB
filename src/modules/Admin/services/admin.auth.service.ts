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

    if (!admin) throw new NotFoundError('no record found ...');

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
    } else {
      throw new UnauthorizedError('login failed, invalid credentials');
    }
  }
);

// export const getUsersAdmin: RequestHandler = catchAsync(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     const { id } = req?.params;
//     ValidateMongoDbId(id);
//     try {
//       if (!id)
//         next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
//       const users = await getUsersAdminM();
//       res.json({
//         length: users.length,
//         users,
//       });
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );

// export const accountVerificationAdmin: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { token, id } = req.params;
//     ValidateMongoDbId(id);
//     if (!id)
//       next(
//         new AppError('Sorry, your id is not valid', StatusCodes.BAD_REQUEST)
//       );

//     if (!token)
//       next(
//         new AppError(
//           'Sorry, this token is not valid, try again',
//           StatusCodes.BAD_REQUEST
//         )
//       );
//     try {
//       const admin = await accountVerificationAdminM(id, token, new Date());

//       if (!admin)
//         next(
//           new AppError(
//             'Sorry, no user found, try again',
//             StatusCodes.BAD_REQUEST
//           )
//         );
//       const updatedAdmin = await accountVerificationUpdatedAdminM(
//         admin?.id as string,
//         true,
//         '',
//         null
//       );
//       res.json({
//         status: 'Success',
//         message: 'You have successfully, verify your account, log in now',
//       });
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );
