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

import { CloudinaryUploader } from '../../../configurations/cloudinary';

import { BadRequestError, NotFoundError } from '../../../errors/customError';

const { sendMailToken } = Email;

const uploader = new CloudinaryUploader();

const { catchAsync, ValidateMongoDbId, generatePasswordResetToken } = Utils;

import { prisma } from '../../../configurations/db';

// const performDelayedDeletion = async (id: string) => {
//   const waitingPeriodInDays = 4; // Adjust this as needed
//   const currentDate = new Date();

//   const usersToDelete = await prisma.user.findMany({
//     where: {
//       deleteRequestDate: {
//         lte: new Date(
//           currentDate.getTime() - waitingPeriodInDays * 24 * 60 * 60 * 1000
//         ),
//       },
//       loggedInAfterRequest: false,
//     },
//   });

//   // Delete the user records
//   for (const user of usersToDelete) {
//     await prisma.user.delete({ where: { id: id } });
//   }
// };

export const user: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await findUserMId(req.params.id);

    if (!user) throw new NotFoundError('no user found, try again');

    res.json({
      status: 'success',
      message: 'your profile',
      data: user,
    });
  }
);

// export const deleteuser: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user = await findUserMId(req.params.id);

//     if (!user) throw new NotFoundError('no user found, try again');

//     await prisma.user.update({
//       where: { id: user.id },
//       data: { deleteRequestDate: new Date() },
//     });

//     user.id &&  await performDelayedDeletion(user.id);
//     res.json({
//       status: 'success',
//       message:
//         'you have successfully requested for account, login before 4 days to reclaim account',
//     });
//   }
// );

export const updateuser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allowedFields = ['firstName', 'lastName', 'email'];

    const unexpectedFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );
    if (unexpectedFields.length > 0)
      throw new BadRequestError(
        `unexpected fields: ${unexpectedFields.join(
          ', '
        )}, sorry it's not part of the parameter`
      );

    const user = await updateUserM(
      req.params.id,
      req.body.firstName,
      req.body.lastName,
      req.body.email
    );
    res.json({
      message: 'You have successfully updated your profile',
      user: user,
    });
  }
);

export const updatepassword: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await updateUserPasswordM(req.body.id, req.body.password);

    if (!user) throw new NotFoundError('no user found');

    res.json({
      status: 'success',
      message: 'You have successfully update your password',
    });
  }
);

// export const uploadProfile: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = req.params.id;
//     ValidateMongoDbId(id);
//     if (!req?.file)
//       throwError(
//         'Sorry, please select an image to be uploaded',
//         StatusCodes.BAD_REQUEST
//       );

//     const image: any = req.file;
//     try {
//       const localPath = `src/uploads/${image.filename}`;

//       const upload: any = await uploader.uploadImage(localPath, 'users');

//       const user = await userProfilePictureUpdateM(id, upload.url);

//       fs.unlinkSync(localPath);

//       res.json({
//         status: 'Success',
//         message: 'You have successfully updated your image',
//       });
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );
