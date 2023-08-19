import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import AppError from '../utils';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../configurations/db';
import { ENV } from '../configurations/config';

export class Utils {
  catchAsync = async (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch((err: any) => next(err));
    };
  };

  ValidateMongoDbId = (id: string) => {
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId)
      new AppError('Invalid Id passed, check your Id', StatusCodes.BAD_REQUEST);
  };

  accountVerificationToken = async (accountType: string, id: string) => {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);

    switch (accountType) {
      case 'user':
        const user = await prisma.user.update({
          where: { id: id },
          data: {
            accountVerificationToken: verificationToken,
            accountVerificationTokenExpires: tokenExpiration,
          },
        });
        console.log('You just signed up now, welcome...');
        return user;

      case 'admin':
        const admin = await prisma.admin.update({
          where: { id: id },
          data: {
            accountVerificationToken: verificationToken,
            accountVerificationTokenExpires: tokenExpiration,
          },
        });
        console.log('Hello from admin');
        return admin;
    }
  };

  generatePasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    return resetToken;
  };

  generateToken = async (id: string) => {
    if (!ENV.JWT.SECRET)
      new AppError(
        'JWT_KEY is required in environment',
        StatusCodes.BAD_REQUEST
      );

    const token = jwt.sign({ id }, ENV.JWT.SECRET as string, {
      expiresIn: ENV.JWT.EXPIRES,
    });
    return token;
  };

  hashedPassword = async (password: string) => {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
}
