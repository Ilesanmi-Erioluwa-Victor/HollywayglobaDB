import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../middlewares/error';

import { ENV } from '../../configurations/env';

import { CustomRequest } from '../../interfaces/custom';

import { userQueries } from '../../modules/User/models/user.auth.model';

import { adminQueries } from '../../modules/Admin/models/admin.models';

import { Utils } from '../../helper/utils';
import { UnauthenticatedError } from '../../errors/customError';

const { catchAsync, ValidateMongoDbId } = Utils;

const { findUserMId } = userQueries;

const { findAdminIdM } = adminQueries;

export class Auth {
  static authenticateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token } = req.cookies;

      if (!token) throw new UnauthenticatedError('authentication failed');

      try {
        const { userId, role } = verifyJWT(token);
        req.user = { userId, role };
        next();
      } catch (error) {
        throw new UnauthenticatedError('authentication failed');
      }
    }
  );

  static VerifiedUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const authId = req?.authId;

      const userId = req?.params?.id;

      if (!authId)
        throwError('Sorry, you are not authorized', StatusCodes.BAD_REQUEST);

      if (!userId) {
        throwError('Sorry, invalid ID', StatusCodes.BAD_REQUEST);
      }

      ValidateMongoDbId(authId as string);

      try {
        const user = await findUserMId(authId as string);

        if (user?.id.toString() !== authId?.toString())
          throwError('Sorry, this ID does not match', StatusCodes.BAD_REQUEST);

        if (!user?.isAccountVerified)
          throwError(
            'Sorry, your account is not verified, please check your email and verify your email',
            StatusCodes.BAD_REQUEST
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
