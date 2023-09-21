import { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { verifyJWT } from '../../utils/index';

import { ENV } from '../../configurations/env';

import {
  NotFoundError,
  UnauthenticatedError,
  BadRequestError,
} from '../../errors/customError';

import { CustomRequest } from '../../interfaces/custom';

import { userQuery } from '../../modules/User/models/user.model';

import { adminQuery } from '../../modules/Admin/models/admin.models';

import { Utils } from '../../helper/utils';

const { catchAsync, ValidateMongoDbId } = Utils;

const { findUserMId } = userQuery;

const { findAdminIdM } = adminQuery;

export class Auth {
  static authenticateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token } = req.cookies;

      if (!token) throw new UnauthenticatedError('authentication failed');

      try {
        const jwt: { userId: string; role: string } | any = verifyJWT(token);
        req.user = { userId: jwt?.userId, role: jwt.role };
        next();
      } catch (error) {
        throw new UnauthenticatedError('authentication failed');
      }
    }
  );

  static verifiedUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_para_id = req.params.id;

      if (!user_para_id)
        throw new UnauthenticatedError('authentication failed');

      try {
        const user = await findUserMId(req.user.userId as string);

        if (!user) throw new NotFoundError('no user found');

        if (user.id.toString() !== req.user.userId.toString())
          throw new BadRequestError('your id does not match, try again');

        if (!user.isAccountVerified)
          throw new BadRequestError(
            'please, verify your account, before you can log in'
          );

        next();
      } catch (error: any) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
      }
    }
  );

  static Admin = catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const authId = req?.authId;

      const adminId = req?.params?.id;

      ValidateMongoDbId(authId as string);

      ValidateMongoDbId(adminId);

      try {
        const admin = await findAdminIdM(adminId);
        if (!admin) throwError('Sorry, No user found', StatusCodes.BAD_REQUEST);

        if (admin?.id !== authId)
          return throwError(
            'Sorry, this ID does not match',
            StatusCodes.BAD_REQUEST
          );

        if (!admin?.isAccountVerified)
          throwError(
            'Please, verify your gmail, before you cam perform this operation',
            StatusCodes.BAD_REQUEST
          );

        if (admin?.role !== 'ADMIN') {
          throwError(
            'Sorry, You cant perform this operation....',
            StatusCodes.BAD_REQUEST
          );
        }

        next();
      } catch (error: any) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
      }
    }
  );
}
