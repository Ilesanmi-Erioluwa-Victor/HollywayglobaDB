import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { throwError } from '../middlewares/cacheError';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../prisma';

dotenv.config();

export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
};

export const ValidateMongoDbId = (id: string) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId)
    throwError('Invalid Id passed, check your Id', StatusCodes.BAD_REQUEST);
};

export const createAccountVerificationToken = async (userId: any) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      accountVerificationToken: verificationToken,
      accountVerificationTokenExpires: tokenExpiration,
    },
  });
  return user;
};

export function generatePasswordResetToken(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 1);

  return resetToken;
}

export const generateToken = (id: string) => {
  if (!process.env.JWT_SERCRET_KEY)
    throwError('JWT_KEY is required in environment', StatusCodes.BAD_REQUEST);

  const token = jwt.sign({ id }, `${process.env.JWT_SERCRET_KEY}`, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });
  return token;
};
