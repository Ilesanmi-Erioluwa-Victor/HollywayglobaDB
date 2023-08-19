import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import AppError from '../../utils';

import { ENV } from '../../configurations/config';
import { CustomRequest } from '../../interfaces/custom';
import { findUserMId } from '../../modules/User/models/user.auth.model';
import { findAdminIdM } from '../../modules/Admin/models/models';
import { Utils } from '../../helper/utils';

const { catchAsync, ValidateMongoDbId } = Utils;

export class Auth {
  static Token = catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      let token;

      try {
        if (
          req.headers.authorization &&
          req?.headers?.authorization.startsWith('Bearer')
        ) {
          token = req?.headers?.authorization.split(' ')[1];

          if (!ENV.JWT.SECRET) {
            throw new AppError(
              'SERVER JWT PASSWORD NOT SET',
              StatusCodes.NOT_FOUND
            );
          }

          if (token) {
            const decoded = jwt.verify(token, ENV.JWT.SECRET) as {
              id: string;
            };
            req.authId = decoded.id;
          }
        } else {
          throw new AppError(
            `Sorry, there is no token attached to your Header, try again by attaching Token..`,
            StatusCodes.NOT_FOUND
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

  static VerifiedUser = catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {

      const authId = req?.authId;

      const userId = req?.params?.id;

      if (!authId)
        next(
          new AppError('Sorry, you are not authorized', StatusCodes.BAD_REQUEST)
        );
      
      if (!userId) {
        next(new AppError('Sorry, invalid ID', StatusCodes.BAD_REQUEST));
      }
      
      ValidateMongoDbId(authId as string);

      try {
        const user = await findUserMId(authId as string);
        if (user?.id.toString() !== authId?.toString())
          next(
            new AppError(
              'Sorry, this ID does not match',
              StatusCodes.BAD_REQUEST
            )
          );

        if (!user?.isAccountVerified)
          new AppError(
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
}

export const AuthMiddleWare = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;

    try {
      if (
        req.headers.authorization &&
        req?.headers?.authorization.startsWith('Bearer')
      ) {
        token = req?.headers?.authorization.split(' ')[1];
        if (!`${ENV.JWT.SECRET}`) {
          new AppError('SERVER JWT PASSWORD NOT SET', StatusCodes.NOT_FOUND);
        }
        if (token) {
          const decoded = jwt.verify(token, `${ENV.JWT.SECRET}`) as {
            id: string;
          };
          req.authId = decoded.id;
        }
      } else {
        new AppError(
          `Sorry, there is no token attached to your Header, try again by attaching Token..`,
          StatusCodes.NOT_FOUND
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

export const isUserVerified = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authId = req?.authId;
    const userId = req?.params?.id;

    if (!authId)
      next(
        new AppError('Sorry, you are not authorized', StatusCodes.BAD_REQUEST)
      );
    if (!userId) {
      next(new AppError('Sorry, invalid ID', StatusCodes.BAD_REQUEST));
    }
    ValidateMongoDbId(authId as string);

    try {
      const user = await findUserMId(authId as string);
      if (user?.id.toString() !== authId?.toString())
        next(
          new AppError('Sorry, this ID does not match', StatusCodes.BAD_REQUEST)
        );

      if (!user?.isAccountVerified)
        new AppError(
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

export const adminRole = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const authId = req?.authId;
      const adminId = req?.params?.id;

      ValidateMongoDbId(authId as string);
      ValidateMongoDbId(adminId);

      const admin = await findAdminIdM(adminId);
      if (!admin)
        next(new AppError('Sorry, No user found', StatusCodes.BAD_REQUEST));

      if (admin?.id !== authId)
        next(
          new AppError('Sorry, this ID does not match', StatusCodes.BAD_REQUEST)
        );

      if (!admin?.isAccountVerified)
        next(
          new AppError(
            'Please, verify your gmail, before you cam perform this operation',
            StatusCodes.BAD_REQUEST
          )
        );

      if (admin?.role !== 'ADMIN') {
        new AppError(
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
