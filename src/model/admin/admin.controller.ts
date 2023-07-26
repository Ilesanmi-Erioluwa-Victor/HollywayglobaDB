import crypto from 'node:crypto';
import { RequestHandler, Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../helper/utils';
import { throwError } from '../../middlewares/error/cacheError';
import { prisma } from '../../configurations/db';

export const adminSignUp: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;

    try {
      if (
        await prisma.admin.findFirst({
          where: {
            email: email as string,
          },
        })
      )
        next(
          throwError(
            'You are already an admin, please,kindly log into your account',
            StatusCodes.CONFLICT
          )
        );

      const admin = AdminModel.create({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
      });

      res.status(201).json({
        message: 'admin account created successfully',
        status: 'Success',
      });
    } catch (error: any) {
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
