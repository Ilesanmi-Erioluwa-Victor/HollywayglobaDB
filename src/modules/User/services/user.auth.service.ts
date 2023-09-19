import fs from 'fs';

import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

import { userQueries } from '../models/user.auth.model';

const {
  findUserMEmail,
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

import { Email } from '../../../templates';

import { loginUserI } from '../user.interface';

import { CloudinaryUploader } from '../../../configurations/cloudinary';

const { sendMailToken } = Email;

const uploader = new CloudinaryUploader();

const { catchAsync, ValidateMongoDbId, generatePasswordResetToken } = Utils;

export const getUser: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    try {
      const user = await findUserMId(id);
      res.json({
        active: user?.active,
        email: user?.email,
        firstName: user?.firstName,
        id: user?.id,
        isAccountVerified: user?.isAccountVerified,
        lastName: user?.lastName,
        mobile: user?.mobile,
        profilePhoto: user?.profilePhoto,
      });
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
      throwError(
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
        throwError(
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
    if (!id) throwError('Sorry, your id is not valid', StatusCodes.BAD_REQUEST);

    if (!token)
      throwError(
        'Sorry, this token is not valid, try again',
        StatusCodes.BAD_REQUEST
      );
    try {
      const user = await accountVerificationM(id, token, new Date());

      if (!user) {
        throwError('Sorry, no user found, try again', StatusCodes.BAD_REQUEST);
      }
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



export const resetPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req?.params;
    const { password } = req.body;

    if (!token)
      throwError(
        'Sorry, invalid token or something went wrong',
        StatusCodes.BAD_GATEWAY
      );

    if (!password)
      throwError(
        'Please, provide password for reset!!!',
        StatusCodes.BAD_REQUEST
      );
    try {
      const resetTokenData = await resetPasswordM(token);
      if (!resetTokenData || resetTokenData.expirationTime <= new Date()) {
        throwError('Invalid or expired token', StatusCodes.NOT_FOUND);
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
      throwError(
        'Sorry, please select an image to be uploaded',
        StatusCodes.BAD_REQUEST
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
