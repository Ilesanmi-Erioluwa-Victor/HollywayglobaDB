import { NextFunction, Request, Response } from 'express';
import { throwError } from './cacheError';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { catchAsync } from '../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../prisma';
import ValidateMongoDbId from '../utils/ValidateMongoId';

dotenv.config();

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
        if (!`${process.env.JWT_SERCRET_KEY}`) {
          throwError('SERVER JWT PASSWORD NOT SET', StatusCodes.BAD_REQUEST);
        }
        if (token) {
          const decoded = jwt.verify(
            token,
            `${process.env.JWT_SERCRET_KEY}`
          ) as {
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
        throwError("Sorry, your account is not verified, please check your email and verify your email", StatusCodes.BAD_REQUEST)
      }
          next();
    } catch (error : any) {
       if (!error.statusCode) {
         error.statusCode = 500;
       }
       next(error);
    }

    
   

  }
);
