import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { throwError } from '../../middlewares/cacheError';
import { StatusCodes } from 'http-status-codes';

import { userModel } from './model.user';
import { catchAsync } from '../../utils/catchAsync';

dotenv.config();

export const create_user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { first_name, last_name, password, email } = req.body;
      if (!first_name || !last_name || !password || !email)
        throwError(
          'Missing credentials, please provide all required information',
          StatusCodes.BAD_REQUEST
        );

      const exist_user = await userModel.findOne({ email });
      const hashedPassword = await bcrypt.hash(password, 12);

      if (exist_user)
        throwError(
          'You are already a member, kindly login to your account',
          StatusCodes.CONFLICT
        );
      const user = await userModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });

      await user.save();
      res.status(StatusCodes.CREATED).json({
        message: 'You have successfully created your account, log in now',
        status: 'success',
        userId: user?._id,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const login_user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const exist_user: any = await userModel.findOne({ email });
      const userCorrectPassword = bcrypt.compare(
        password,
        exist_user?.password
      );
      if (!exist_user || !(await userCorrectPassword))
        throwError(
          'Sorry, Invalid credentials..., Check your credentials',
          StatusCodes.BAD_REQUEST
        );

      const token = jwt.sign(
        {
          email: exist_user?.email,
          id: exist_user?._id,
        },
        `${process.env.JWT_SERCRET_KEY}`,
        { expiresIn: `${process.env.JWT_EXPIRES_IN}` }
      );

      res.status(200).json({
        status : "Success",
        message: 'user logged in successfully',
        token,
        userId: exist_user?._id,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const protect: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
     let token;
     if (
       req.headers.authorization &&
       req.headers.authorization.startsWith('Bearer')
     ) {
       token = req.headers.authorization.split(' ')[1];
     }

  } catch (error: any) {
     if (!error.statusCode) {
       error.statusCode = 500;
     }
     next(error);
  }
})
