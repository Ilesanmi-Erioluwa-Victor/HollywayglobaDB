import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils';
import {
  catchAsync,
  ValidateMongoDbId,
  generateToken,
} from '../../../helper/utils';
import { CustomRequest } from '../../../interfaces/custom';
import {
  accountVerificationAdminM,
  accountVerificationUpdatedAdminM,
  createAdminM,
  findAdminEmailM,
  getUsersAdminM,
} from '../models';
import { sendMailAdmin } from '../../../templates/sendMail';
import { loginAdminI } from '../admin.interface';
import { getProductsM } from '../../Product/product.models';

export const adminSignup: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name)
        return next(
          new AppError(
            'Missing credentials, please provide all required information',
            StatusCodes.BAD_REQUEST
          )
        );
      const existAdmin = await findAdminEmailM(email);
      if (existAdmin)
        return next(
          new AppError(
            'You are already an admin, kindly login to your account',
            StatusCodes.CONFLICT
          )
        );
      const admin = await createAdminM(req.body);
      sendMailAdmin(admin, req, res, next);
      res.status(StatusCodes.CREATED).json({
        message: 'You have successfully created your account, log in now',
        status: 'success',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const loginAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const admin: loginAdminI | any = await findAdminEmailM(email);

      if (!admin)
        next(
          new AppError('No record found with this email', StatusCodes.BAD_REQUEST)
        );
      if (await bcrypt.compare(password, admin?.password)) {
        if (!admin.isAccountVerified) {
          new AppError(
            'Verify your account in your gmail before you can log in',
            StatusCodes.BAD_REQUEST
          );
        }

        res.json({
          id: admin?.id,
          name: admin?.name,
          email: admin?.email,
          token: generateToken(admin?.id),
        });
      } else {
        new AppError(
          'Login Failed, invalid credentials',
          StatusCodes.UNAUTHORIZED
        );
      }
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const getUsersAdmin: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    try {
      if (!id)
        next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
      const users = await getUsersAdminM();
      res.json({
        length: users.length,
        users,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const getProducts: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
   if (!id)
     next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
    try {
      const products = await getProductsM();
      res.json({
        status: 'Success',
        data: products,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const accountVerificationAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, id } = req.params;
    ValidateMongoDbId(id);
    if (!id)
      next(
        new AppError('Sorry, your id is not valid', StatusCodes.BAD_REQUEST)
      );

    if (!token)
      next(
        new AppError(
          'Sorry, this token is not valid, try again',
          StatusCodes.BAD_REQUEST
        )
      );
    try {
      const admin = await accountVerificationAdminM(id, token, new Date());

      if (!admin)
        next(
          new AppError(
            'Sorry, no user found, try again',
            StatusCodes.BAD_REQUEST
          )
        );
      const updatedAdmin = await accountVerificationUpdatedAdminM(
        admin?.id as string,
        true,
        '',
        null
      );
      res.json({
        status: 'Success',
        message: 'You have successfully, verify your account, log in now',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
