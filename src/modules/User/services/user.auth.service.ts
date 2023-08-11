import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import AppError from '../../../utils';
import {
  catchAsync,
  ValidateMongoDbId,
  generateToken,
  generatePasswordResetToken,
} from '../../../helper/utils';
import { CustomRequest } from '../../../interfaces/custom';
import {
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
  createAddressM,
  updateAddressM,
  findUserWithAddressM,
} from '../models';
import { sendMail, sendUserToken } from '../../../templates/sendMail';
import { loginUserI } from '../user.interface';
import { cloudinaryUploadImage } from '../../../configurations/cloudinary';

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

      const user = await createUserM(req.body);
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
      if (await bcrypt.compare(password, user?.password)) {
        if (!user.isAccountVerified) {
          new AppError(
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
          token: generateToken(user?.id),
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

export const updateUser = catchAsync(
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

export const updatePassword = catchAsync(
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
        resetToken,
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
      const upload: any = await cloudinaryUploadImage(localPath, 'users');
      console.log(upload);
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

export const createAddress: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    ValidateMongoDbId(id);
    if (!id) new AppError('Invalid ID', StatusCodes.FORBIDDEN);
    const {
      deliveryAddress,
      additionalInfo,
      region,
      city,
      phone,
      additionalPhone,
    } = req.body;
    // TODO, I want to add JOI as validator
    try {
      const user = await createAddressM(req.body, id);
      res.json({
        deliveryAddress: user.deliveryAddress,
        additionalInfo: user.additionalInfo,
        region: user.region,
        city: user.city,
        phone: user.phone,
        additionalPhone: user.additionalPhone,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

// TODO a bug to fix here..
export const editAddress: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    ValidateMongoDbId(id);
    if (!id) new AppError('Invalid ID', StatusCodes.BAD_REQUEST);
    try {
      const userWithAddress = await findUserWithAddressM(id);
      const userWithAddressId = userWithAddress?.address[0].id;
      const userAddress = await updateAddressM(
        userWithAddressId as string,
        req.body
      );
      res.json({
        deliveryAddress: userAddress.deliveryAddress,
        additionalInfo: userAddress.additionalInfo,
        region: userAddress.region,
        city: userAddress.city,
        phone: userAddress.phone,
        additionalPhone: userAddress.additionalPhone,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
