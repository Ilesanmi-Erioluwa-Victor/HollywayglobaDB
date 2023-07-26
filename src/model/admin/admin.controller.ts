import bcrypt from 'bcryptjs';
import { RequestHandler, Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  catchAsync,
  createAccountVerificationToken,
  generateToken,
} from '../../helper/utils';
import { throwError } from '../../middlewares/error/cacheError';
import { prisma } from '../../configurations/db';
import { Admin } from './../../interfaces/custom';
import { sendMail } from '../../templates/sendMail';

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
      console.log(admin);
      // generateToken(admin?.id as string);
      // const tokenAdmin = await createAccountVerificationToken(admin?.id);
      // await sendMail(tokenAdmin, req, res, next);

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

// export const login: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;
//     try {
//       const admin = await AdminModel.findOne({ email: email });

//       // if (admin && (await admin.isPasswordMatched(password))) {
//       //   res.json({
//       //     _id: admin?._id,
//       //     token: generateToken(admin?._id),
//       //   });
//       // } else {
//       //   res.status(401); throwError(`Login Failed, invalid credentials..`, StatusCodes.BAD_REQUEST);

//       // }
//     } catch (error) {}
//   }
// );
