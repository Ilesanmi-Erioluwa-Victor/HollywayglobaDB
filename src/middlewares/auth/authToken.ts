import { NextFunction, Request, Response } from 'express';
import { throwError } from '../error/cacheError';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../../helper/utils';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configurations/db';
import { ValidateMongoDbId } from '../../helper/utils';
import { ENV } from '../../configurations/config';
import { CustomRequest } from '../../interfaces/custom';

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
          throwError('SERVER JWT PASSWORD NOT SET', StatusCodes.BAD_REQUEST);
        }
        if (token) {
          const decoded = jwt.verify(token, `${ENV.JWT.SECRET}`) as {
            id: string;
            role: string;
          };
          req.authId = decoded.id;
        }
      } else {
        throwError(
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
    if (!req?.authId)
      next(
        throwError('Sorry, you are not authorized', StatusCodes.BAD_REQUEST)
      );
    try {
      const id = req?.authId;
      ValidateMongoDbId(id as string);

      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user?.isAccountVerified) {
        throwError(
          'Sorry, your account is not verified, please check your email and verify your email',
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

export const adminRole = (roles: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const authId = req?.authId;
      const adminId = req?.params?.id;

      ValidateMongoDbId(authId as string);
      ValidateMongoDbId(adminId);

      const admin = await prisma.admin.findUnique({
        where: {
          id: adminId,
        },
      });

      if (!admin)
        next(throwError('Sorry, No user found', StatusCodes.BAD_REQUEST));

      if (admin?.id !== authId)
        next(
          throwError('Sorry, this ID does not match', StatusCodes.BAD_REQUEST)
        );

      if (!admin?.isAccountVerified)
        next(
          throwError(
            'Please, verify your gmail, before you cam perform this operation',
            StatusCodes.BAD_REQUEST
          )
        );
        console.log(admin?.role)

       if (!roles.includes(admin?.role as string)) {
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
  };
};
