import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { throwError } from '../middlewares/error/cacheError';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../configurations/db';
import { ENV } from '../configurations/config';
// import multer from "multer"

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

export const createAccountVerificationTokenAdmin = async (adminId: any) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
  const admin = await prisma.admin.update({
    where: { id: adminId },
    data: {
      accountVerificationToken: verificationToken,
      accountVerificationTokenExpires: tokenExpiration,
    },
  });
  return admin;
};

export function generatePasswordResetToken(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 1);

  return resetToken;
}

export const generateToken = (id: string) => {
  if (!ENV.JWT.SECRET)
    throwError('JWT_KEY is required in environment', StatusCodes.BAD_REQUEST);

  const token = jwt.sign({ id }, `${ENV.JWT.SECRET}`, {
    expiresIn: `${ENV.JWT.EXPIRES}`,
  });
  return token;
};

export async function hashedPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  return hashedPassword;
}


// export const upload = multer({dest : "src/uploads"})
 
