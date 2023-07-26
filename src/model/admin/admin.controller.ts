import bcrypt from 'bcryptjs';
import { RequestHandler, Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  catchAsync,
  createAccountVerificationTokenAdmin,
  generateToken,
} from '../../helper/utils';
import { throwError } from '../../middlewares/error/cacheError';
import { prisma } from '../../configurations/db';
import { Admin, loginAdmin } from './../../interfaces/custom';
import { sendMailAdmin } from '../../templates/sendMail';

export const adminSignUp: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name)
        return next(
          throwError(
            'Missing credentials, please provide all required information',
            StatusCodes.BAD_REQUEST
          )
        );
      const exist_admin = await prisma.admin.findUnique({ where: { email } });
      if (exist_admin) {
        return next(
          throwError(
            'You are already an admin, kindly login to your account',
            StatusCodes.CONFLICT
          )
        );
      }

      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const admin: Admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      generateToken(admin?.id as string);
      const tokenAdmin = await createAccountVerificationTokenAdmin(admin?.id);
      await sendMailAdmin(tokenAdmin, req, res, next);

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

export const adminSignIn: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const admin: loginAdmin | any = await prisma.admin?.findUnique({
        where: {
          email,
        },
      });
      if (!admin) {
        throwError('No user found', StatusCodes.BAD_REQUEST);
      }

      if (await bcrypt.compare(password, admin?.password)) {
        if (!admin.isAccountVerified) {
          throwError(
            'Verify your account in your gmail before you can log in',
            StatusCodes.BAD_REQUEST
          );
        }
        res.json({
          id: admin?.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          profilePhoto: admin.profilePhoto,
          token: generateToken(admin?.id),
        });
      } else {
        res.status(401);
        throwError(
          `Login Failed, invalid credentials..`,
          StatusCodes.BAD_REQUEST
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

export const adminAccount_Verification: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    try {
      const user = await prisma.admin.findFirst({
        where: {
          accountVerificationToken: token,
          accountVerificationTokenExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throwError(
          'Token expired or something went wrong, try again',
          StatusCodes.BAD_REQUEST
        );
      }

      const updatedUser = await prisma.admin.update({
        where: {
          id: user?.id,
        },
        data: {
          isAccountVerified: true,
          accountVerificationToken: '',
          accountVerificationTokenExpires: null,
        },
      });

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
