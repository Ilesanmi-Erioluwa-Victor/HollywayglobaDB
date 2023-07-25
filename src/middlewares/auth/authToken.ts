import { NextFunction, Request, Response } from 'express';
import { throwError } from '../error/cacheError';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../../helper/utils';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configurations/db';
import { ValidateMongoDbId } from '../../helper/utils';
import { ENV } from '../../configurations/config';
interface CustomRequest extends Request {
  authId?: string;
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
          throwError('SERVER JWT PASSWORD NOT SET', StatusCodes.BAD_REQUEST);
        }
        if (token) {
          const decoded = jwt.verify(token, `${ENV.JWT.SECRET}`) as {
            id: string;
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

interface CustomUser extends Request {
  authId?: string;
}

export const isUserVerified = catchAsync(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      const id: string | any = req?.authId;
      ValidateMongoDbId(id);

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
