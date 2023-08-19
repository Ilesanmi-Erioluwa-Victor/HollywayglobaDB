import fs from 'fs';

import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import AppError from '../../../utils';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

import { userQueries } from '../models/user.auth.model';

const {
  findUserMEmail,
  createUserM,
  findUserMId,
  updateUserM,
  updateUserPasswordM,
  accountVerificationUpdatedM,
  forgetPasswordTokenM,
  accountVerificationM,
  resetPasswordM,
  resetPasswordUpdateM,
  resetPasswordTokenDeleteM,
  userProfilePictureUpdateM,
} = userQueries;

import { sendMail, sendUserToken } from '../../../templates/sendMail';

import { loginUserI } from '../user.interface';

import { CloudinaryUploader } from '../../../configurations/cloudinary';

const uploader = new CloudinaryUploader();

const {
  catchAsync,
  generateToken,
  ValidateMongoDbId,
  generatePasswordResetToken,
  comparePassword,
} = Utils;

export const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, password, email, mobile } = req.body;
      if (!firstName || !lastName || !password || !email || !mobile)
        return next(
          new AppError(
            'Missing credentials, please provide all required information',
            StatusCodes.BAD_REQUEST
          )
        );

      const existEmail = await findUserMEmail(email);
      if (existEmail)
        next(
          new AppError(
            'You are already a member, kindly login to your account',
            StatusCodes.CONFLICT
          )
        );

      const user: any = await createUserM(req.body);
      sendMail(user, req, res, next);
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

export const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user: loginUserI | any = await findUserMEmail(email);

      if (!user)
        next(
          new AppError('No user found with this email', StatusCodes.BAD_REQUEST)
        );
      if (await comparePassword(password, user?.password)) {
        if (!user.isAccountVerified) {
          throw new AppError(
            'Verify your account in your gmail before you can log in',
            StatusCodes.BAD_REQUEST
          );
        }

        res.json({
          id: user?.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePhoto: user.profilePhoto,
          token: await generateToken(user?.id),
        });
      } else {
        throw new AppError(
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

export const getUser: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    try {
      const user = await findUserMId(id);
      res.json(user);
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const updateUser: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);

    const allowedFields = ['firstName', 'lastName', 'email'];
    const unexpectedFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );
    if (unexpectedFields.length > 0) {
      new AppError(
        `Unexpected fields: ${unexpectedFields.join(
          ', '
        )}, Sorry it's not part of the parameter`,
        StatusCodes.BAD_REQUEST
      );
    }
    try {
      const user = await updateUserM(
        id,
        req.body.firstName,
        req.body.lastName,
        req.body.email
      );
      res.json({
        message: 'You have successfully updated your profile',
        user: user,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const updatePassword: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    const { password } = req.body;
    try {
      ValidateMongoDbId(id);
      if (!password)
        new AppError(
          'Please, provide password before you can change your current password',
          StatusCodes.BAD_REQUEST
        );
      const user = await updateUserPasswordM(id, password);

      res.json({
        message: 'You have successfully update your password',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const accountVerification: RequestHandler = catchAsync(
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
      const user = await accountVerificationM(id, token, new Date());

      if (!user)
        next(
          new AppError(
            'Sorry, no user found, try again',
            StatusCodes.BAD_REQUEST
          )
        );
      const updaterUser = await accountVerificationUpdatedM(
        user?.id as string,
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

export const forgetPasswordToken: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email)
      new AppError(
        'Please, provide email for you to reset your password',
        StatusCodes.BAD_REQUEST
      );
    const user = await findUserMEmail(email);
    if (!user)
      new AppError(
        'No user found with provided email.., try again',
        StatusCodes.NOT_FOUND
      );

    try {
      const resetToken = generatePasswordResetToken();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      const passwordReset = await forgetPasswordTokenM(
        await resetToken,
        expirationTime,
        user?.id as string
      );

      await sendUserToken(passwordReset, req, res, next);
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

export const resetPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req?.params;
    const { password } = req.body;

    if (!token)
      next(
        new AppError(
          'Sorry, invalid token or something went wrong',
          StatusCodes.BAD_GATEWAY
        )
      );

    if (!password)
      next(
        new AppError(
          'Please, provide password for reset!!!',
          StatusCodes.BAD_REQUEST
        )
      );
    try {
      const resetTokenData = await resetPasswordM(token);
      if (!resetTokenData || resetTokenData.expirationTime <= new Date()) {
        new AppError('Invalid or expired token', StatusCodes.NOT_FOUND);
      }

      const user = await resetPasswordUpdateM(
        resetTokenData?.user?.id as string,
        password
      );

      const deleteUserPasswordResetToken = await resetPasswordTokenDeleteM(
        resetTokenData?.id as string
      );

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

export const uploadProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    ValidateMongoDbId(id);
    if (!req?.file)
      next(
        new AppError(
          'Sorry, please select an image to be uploaded',
          StatusCodes.BAD_REQUEST
        )
      );

    const image: any = req.file;
    try {
      const localPath = `src/uploads/${image.filename}`;

      const upload: any = await uploader.uploadImage(localPath, 'users');

      const user = await userProfilePictureUpdateM(id, upload.url);

      fs.unlinkSync(localPath);

      res.json({
        status: 'Success',
        message: 'You have successfully updated your image',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
