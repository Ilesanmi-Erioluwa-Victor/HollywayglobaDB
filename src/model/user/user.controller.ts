import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { throwError } from '../../middlewares/cacheError';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import ValidateMongoDbId from '../../utils/ValidateMongoId';
import generateToken from '../../config/generateToken/token';
import { prisma } from '../../prisma';
import { UserModel } from './model.user';
import { createAccountVerificationToken } from '../../helper/createAccountverification';
import { sendMail } from '../../helper/sendMail';
import { generateVerificationToken } from '../../helper/generateToken';

dotenv.config();

interface CustomRequest extends Request {
  authId?: string; // Replace 'any' with the appropriate type for the user object
}

export const create_user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, password, email, mobile } = req.body;
      if (!firstName || !lastName || !password || !email || !mobile)
        return next(
          throwError(
            'Missing credentials, please provide all required information',
            StatusCodes.BAD_REQUEST
          )
        );

      const exist_user = await prisma.user.findUnique({ where: { email } });
      if (exist_user) {
        return next(
          throwError(
            'You are already a member, kindly login to your account',
            StatusCodes.CONFLICT
          )
        );
      }
      // TODO  i will write it to it logic util later
      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          firstName: firstName as string,
          lastName: lastName as string,
          email: email as string,
          password: hashedPassword,
          mobile: mobile as string,
        },
      });
      generateToken(user?.id);
      const tokenUser: any = await createAccountVerificationToken(user?.id);
      await sendMail(tokenUser, req, res, next);

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
export const login_user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const exist_user: any = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!exist_user) {
        throwError('No user found', StatusCodes.BAD_REQUEST);
      }

      if (await bcrypt.compare(password, exist_user.password)) {
        if (!exist_user.isAccountVerified) {
          throwError(
            'Verify your account in your gmail before you can log in',
            StatusCodes.BAD_REQUEST
          );
        }

        res.json({
          id: exist_user?.id,
          firstName: exist_user.firstName,
          lastName: exist_user.lastName,
          email: exist_user.email,
          profilePhoto: exist_user.profilePhoto,
          token: generateToken(exist_user?.id),
        });
      } else {
        throwError(
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

export const get_users: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users: string | any = await prisma.user.findMany();
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

export const delete_user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id }: any = req?.params;
    ValidateMongoDbId(id);
    //TODO i want to write logic to deleted permanently if active
    // is false for two months
    try {
      const deleted_user: string | any = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          active: false,
          isAccountVerified: false,
        },
      });

      res.json({
        message:
          'Please, kindly note, by not logining to your account for two months, this will permanently delete your account.',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const get_user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id }: string | any = req?.params;
    ValidateMongoDbId(id);
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      res.json(user);
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

// export const User_profile = expressAsyncHandler(async (req, res) => {
//   const { id } = req?.params;
//   ValidateMongoDbId(id);
//   try {
//     const userProfile = await User.findById(id).populate('posts');
//     res.json(userProfile);
//   } catch (error: any) {
//     res.json(error.message);
//   }
// });

export const update_user = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);

    const allowedFields = ['firstName', 'lastName', 'email'];
    const unexpectedFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );
    if (unexpectedFields.length > 0) {
      throwError(
        `Unexpected fields: ${unexpectedFields.join(', ')}, Sorry it's not part of the parameter`,
        StatusCodes.BAD_REQUEST
      );
    }
    try {
      const userprofile: string | any = await prisma.user.update({
        where: {
          id,
        },
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        },
      });

      res.json({
        message: 'You have successfully updated your profile',
        user: userprofile,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const update_password = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req?.params;
      const { password } = req.body;
      ValidateMongoDbId(id);

      // TODO  i will write it to it logic util later
      const salt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPassword,
        },
      });
      if (password) {
        res.json({
          message: 'You have successfully update your password',
        });
      }
      // TODO still have a bug to fix, which, when user don't provide password, use the initial one
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

// export const generate_verification = catchAsync(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     const { id }: string | any = req?.params;
//     ValidateMongoDbId(id);
//     try {
//       const user: string | any = await prisma.user.findUnique({
//         where: {
//           id,
//         },
//       });
//       createAccountVerificationToken(id);
//       sendMail(user, req, res, next);
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );

export const account_verification: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    console.log(token);
    try {
      const user = await prisma.user.findFirst({
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

      const updatedUser = await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          isAccountVerified: true,
          accountVerificationToken: '',
          accountVerificationTokenExpires: null,
        },
      });

      res.json(updatedUser);
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const forget_password_token: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user: string | any = await UserModel.findOne({ email });
    if (!user) throwError('No user found.., try again', StatusCodes.NOT_FOUND);

    try {
      const token = await user.createPasswordResetToken();
      await user.save();

      //   const resetUrl = `If you were requested to reset your account password, reset now, otherwise ignore this message
      //   <a href= ${req.protocol}://${req.get(
      //     'host'
      //   )}/api/v1/users/verifyAccount/${token}>Click to verify..</a>
      //  `;
      // const msg = {
      //   to: email,
      //   from: 'ericjay1452@gmail.com',
      //   subject: 'Verify your email',
      //   html: resetUrl,
      // };
      // const sendMsg = await sgMail.send(msg);
      res.json({
        message: `A successful message has been sent to your gmail`,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

// export const forgot_password: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user: string | any = await UserModel.findOne({
//       email: req.body.email,
//     });
//     console.log(user);

//     if (!user)
//       return next(
//         throwError(
//           'Sorry, No user found with this email',
//           StatusCodes.BAD_REQUEST
//         )
//       );

//     try {
//       const resetToken = user.createPasswordResetToken();
//       await user.save({ validateBeforeSave: false });

//       const resetURL = `${req.protocol}://${req.get(
//         'host'
//       )}/api/v1/users/resetPassword/${resetToken}`;

//       const emailjsTemplate = {
//         service_id: 'default_service',
//         template_id: `${process.env.EMAILJS_TEMPLATE_ID}`,
//         user_id: `${process.env.EMAILJS_PUBLIC_KEY}`,
//         accessToken: `${process.env.EMAILJS_PRIVATE_KEY}`,
//         template_params: {
//           name: user?.first_name,
//           message: `Forgot your  password ? make a
//       request with your new password and passwordConfirm to
//        ${resetURL}.\nif you didn't forget your password, please ignore this email`,
//           subject: 'Password reset Token',
//         },
//       };
//       await axios
//         .post('https://api.emailjs.com/api/v1.0/email/send', {
//           data: JSON.stringify(emailjsTemplate),
//           contentType: 'application/json',
//         })
//         .then((response) => console.log(response));

//       res.status(StatusCodes.OK).json({
//         status: 'success',
//         message: 'Token sent to your email',
//       });
//     } catch (error: any) {
//       user.password_reset_token = undefined;
//       user.password_reset_expires = undefined;
//       await user.save({ validateBeforeSave: false });
//       console.log(error);
//       return next(
//         throwError(
//           'There was an error sending Email, try again',
//           StatusCodes.BAD_GATEWAY
//         )
//       );
//     }
//   }
// );

export const reset_password: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;

    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await UserModel.findOne({
        password_reset_token: hashedToken,
        password_reset_expires: {
          $gt: Date.now(),
        },
      });

      if (!user) {
        return next(
          throwError('Token is invalid or has expired', StatusCodes.BAD_REQUEST)
        );
      }
      await UserModel.updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            password,
            password_reset_token: '',
            password_reset_expires: '',
          },
        }
      );
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
