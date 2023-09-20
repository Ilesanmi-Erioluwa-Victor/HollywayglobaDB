import fs from 'fs';

import { RequestHandler, NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

import { userQuery } from '../models/user.model';

const {
  findUserMEmail,
  findUserMId,
  updateUserM,
  updateUserPasswordM,
  userProfilePictureUpdateM,
} = userQuery;

import { Email } from '../../../templates';

import { loginUserI } from '../user.interface';

import { CloudinaryUploader } from '../../../configurations/cloudinary';

const { sendMailToken } = Email;

const uploader = new CloudinaryUploader();

const { catchAsync, ValidateMongoDbId, generatePasswordResetToken } = Utils;

export const user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
      const user = await findUserMId(req.params.id);
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
