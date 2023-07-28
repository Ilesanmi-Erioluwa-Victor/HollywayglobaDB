import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { throwError } from '../../middlewares/error/cacheError';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../helper/utils';
import { ValidateMongoDbId } from '../../helper/utils';
import { generateToken } from '../../helper/utils';
import { prisma } from '../../configurations/db';
import { createAccountVerificationToken } from '../../helper/utils';
import { sendMail, sendUserToken } from '../../templates/sendMail';
import { generatePasswordResetToken } from '../../helper/utils';
import { CustomRequest } from '../../interfaces/custom';
import { signupUser, loginUser } from '../../interfaces/custom';

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
 
      const user: signupUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          mobile,
        },
      });
      generateToken(user?.id as string);
      const tokenUser = await createAccountVerificationToken(user?.id);
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
      const exist_user: loginUser | any = await prisma.user?.findUnique({
        where: {
          email: email,
        },
      });

      if (!exist_user) {
        throwError('No user found', StatusCodes.BAD_REQUEST);
      }

      if (await bcrypt.compare(password, exist_user?.password)) {
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

export const delete_user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    //TODO i want to write logic to deleted permanently if active
    // is false for two months
    try {
      const deleted_user = await prisma.user.update({
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
    const { id } = req?.params;
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
        `Unexpected fields: ${unexpectedFields.join(
          ', '
        )}, Sorry it's not part of the parameter`,
        StatusCodes.BAD_REQUEST
      );
    }
    try {
      const userprofile = await prisma.user.update({
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
      if (!password)
        throwError(
          'Please, provide password before you can change your current password',
          StatusCodes.BAD_REQUEST
        );
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

export const account_verification: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, id } = req.params;
    // const authId = req?.authId;
    //   if (!authId)
    // next(
    //   throwError('Sorry, you are not authorized', StatusCodes.BAD_REQUEST)
    // );

    // ValidateMongoDbId(authId as string);
    ValidateMongoDbId(id);

    console.log(id);

    try {
      if (!id)
        next(
          throwError('Sorry, your id is not valid', StatusCodes.BAD_REQUEST)
        );

      if (!token)
        next(
          throwError(
            'Sorry, this token is not valid, try again',
            StatusCodes.BAD_REQUEST
          )
        );

      const user = await prisma.user.findUnique({
        where: {
          id: id,
          accountVerificationToken: token,
          accountVerificationTokenExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throwError('Sorry, no user found, try again', StatusCodes.BAD_REQUEST);
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

export const forget_password_token: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email)
      throwError(
        'Please, provide email for you to reset your password',
        StatusCodes.BAD_REQUEST
      );
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user)
      throwError(
        'No user found with provided email.., try again',
        StatusCodes.NOT_FOUND
      );

    try {
      const resetToken = generatePasswordResetToken();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      const password_reset = await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          expirationTime,
          userId: user?.id as string,
        },
      });

      await sendUserToken(password_reset, req, res, next);
      res.json({
        message: `A reset token has been sent to your gmail`,
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

export const reset_password: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req?.params;
    const { password } = req.body;

    try {
      if (!token) {
        throwError(
          'Sorry, invalid token or something went wrong',
          StatusCodes.BAD_GATEWAY
        );
      }

      if (!password) {
        throwError(
          'Please, provide password for reset',
          StatusCodes.BAD_REQUEST
        );
      }

      const resetTokenData = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });
      if (!resetTokenData || resetTokenData.expirationTime <= new Date()) {
        throwError('Invalid or expired token', StatusCodes.NOT_FOUND);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await prisma.user.update({
        where: { id: resetTokenData?.user?.id },
        data: {
          password: hashedPassword,
        },
      });

      await prisma.passwordResetToken.delete({
        where: { id: resetTokenData?.id },
      });

      res.json({
        message: 'Password reset successful, login now',
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
