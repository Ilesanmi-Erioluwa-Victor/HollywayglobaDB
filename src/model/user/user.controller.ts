import mongoose from 'mongoose';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { throwError } from '../../middlewares/cacheError';
import { StatusCodes } from 'http-status-codes';

import { UserModel } from './model.user';
import { catchAsync } from '../../utils/catchAsync';
import ValidateMongoDbId from '../../utils/ValidateMongoId';
import generateToken from '../../config/generateToken/token';

dotenv.config();

interface AuthenticatedRequest extends Request {
  user: any; // Replace 'any' with the appropriate type for the user object
}

export const create_user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, password, email } = req.body;
      if (!firstName || !lastName || !password || !email)
        return next(
          throwError(
            'Missing credentials, please provide all required information',
            StatusCodes.BAD_REQUEST
          )
        );

      const exist_user = await UserModel.findOne({ email });

      if (exist_user) {
        return next(
          throwError(
            'You are already a member, kindly login to your account',
            StatusCodes.CONFLICT
          )
        );
      }

      const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password,
      });
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
      const exist_user: any = await UserModel.findOne({ email });
      if (exist_user && (await exist_user.isPasswordMatched(password))) {
        res.json({
          _id: exist_user?._id,
          firstName: exist_user?.firstName,
          lastName: exist_user?.lastName,
          email: exist_user?.email,
          profilePhoto: exist_user?.profilePhoto,
          token: generateToken(exist_user?._id),
        });
      } else {
        res.status(401);
        next(
          throwError(
            `Login Failed, invalid credentials..`,
            StatusCodes.NOT_FOUND
          )
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

// export const protect: RequestHandler = catchAsync(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     try {
//       let token;
//       if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//       ) {
//         token = req.headers.authorization.split(' ')[1];
//       }

//       if (!token) {
//         return next(
//           throwError('You are not logged in! Please log in to get access.', 401)
//         );
//       }

//       //  Verification token
//       const decoded: any = jwt.verify(
//         token,
//         `${process.env.JWT_SERCRET_KEY}`,
//         (err, decoded) => {
//           if (err) return next(throwError(`${err}`, StatusCodes.BAD_REQUEST));
//           return decoded;
//         }
//       );

//       const current_user = await UserModel.findById(decoded?.id);

//       if (!current_user) {
//         return next(
//           throwError(
//             'The user belonging to this token does no longer exist.',
//             StatusCodes.BAD_REQUEST
//           )
//         );
//       }

//       // ) Check if user changed password after the token was issued
//       if (current_user.changePasswordAfter(decoded.iat)) {
//         return next(
//           throwError(
//             'User recently changed password! Please log in again.',
//             StatusCodes.BAD_REQUEST
//           )
//         );
//       }

//       // GRANT ACCESS TO PROTECTED ROUTE
//       req.user = current_user;
//       next();
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );

export const get_users: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find({});
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
    const { id } : any = req?.params;
    ValidateMongoDbId(id);
    try {
      const deleted_user: any = await UserModel.findByIdAndDelete(id);
      res.json(deleted_user);
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
    const { id } = req?.params;
    ValidateMongoDbId(id);
    try {
      const user = await UserModel.findById(id);
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

export const forgot_password: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: any = await UserModel.findOne({ email: req.body.email });
    console.log(user);

    if (!user)
      return next(
        throwError(
          'Sorry, No user found with this email',
          StatusCodes.BAD_REQUEST
        )
      );

    try {
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;

      const emailjsTemplate = {
        service_id: 'default_service',
        template_id: `${process.env.EMAILJS_TEMPLATE_ID}`,
        user_id: `${process.env.EMAILJS_PUBLIC_KEY}`,
        accessToken: `${process.env.EMAILJS_PRIVATE_KEY}`,
        template_params: {
          name: user?.first_name,
          message: `Forgot your  password ? make a
      request with your new password and passwordConfirm to
       ${resetURL}.\nif you didn't forget your password, please ignore this email`,
          subject: 'Password reset Token',
        },
      };
      await axios
        .post('https://api.emailjs.com/api/v1.0/email/send', {
          data: JSON.stringify(emailjsTemplate),
          contentType: 'application/json',
        })
        .then((response) => console.log(response));

      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Token sent to your email',
      });
    } catch (error: any) {
      user.password_reset_token = undefined;
      user.password_reset_expires = undefined;
      await user.save({ validateBeforeSave: false });
      console.log(error);
      return next(
        throwError(
          'There was an error sending Email, try again',
          StatusCodes.BAD_GATEWAY
        )
      );
    }
  }
);

export const reset_password = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

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
  }
);
