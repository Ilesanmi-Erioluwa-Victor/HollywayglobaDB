import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { addressQuery } from '../models/user.address.model';

const { catchAsync, ValidateMongoDbId } = Utils;

import { userQuery } from '../models/user.model';

const { findUserMId } = userQuery;

const {
  createAddressM,
  findAddressesByUserId,
  countUserAddresses,
  updateAddressM,
  findUserWithAddressAndDeleteM,
  findAddressM,
} = addressQuery;

// export const createaddress: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {


//     const {
//       deliveryAddress,
//       additionalInfo,
//       region,
//       city,
//       phone,
//       additionalPhone,
//     } = req.body;

    // TODO, I want to add JOI as validator
//     try {
//       const addressCount = await countUserAddresses(id);

//       if (addressCount >= 4) {
//         return res.status(StatusCodes.FORBIDDEN).json({
//           status: 'error',
//           message: 'Maximum number of addresses reached.',
//         });
//       }

//       const user = await createAddressM(req.body, id);
//       res.json({
//         status: 'success',
//         data: {
//           deliveryAddress: user.deliveryAddress,
//           additionalInfo: user.additionalInfo,
//           region: user.region,
//           city: user.city,
//           phone: user.phone,
//           additionalPhone: user.additionalPhone,
//         },
//       });
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );

// export const editAddress = catchAsync(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     const { id, addressId } = req.params;

//     ValidateMongoDbId(id);
//     ValidateMongoDbId(addressId);
//     if (!id) throwError('Invalid ID', StatusCodes.NOT_FOUND);

//     if (!addressId) throwError('Invalid ID', StatusCodes.NOT_FOUND);

//     try {
//       const existingAddress = await findAddressM(addressId);
//       addressId;

//       if (!existingAddress)
//         throwError('No address found', StatusCodes.NOT_FOUND);

//       const updatedAddress = await updateAddressM(
//         addressId as string,
//         req.body
//       );

//       if (!updatedAddress)
//         throwError(
//           'Sorry, something went wrong, try again',
//           StatusCodes.BAD_REQUEST
//         );

//       res.json({
//         status: 'success',
//         message: 'ok',
//       });
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );

// export const getAddresses = catchAsync(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     ValidateMongoDbId(id);
//     if (!id) throwError('Invalid ID', StatusCodes.BAD_REQUEST);
//     try {
//       const addresses = await findAddressesByUserId(id);

//       if (!addresses) throwError('No addresses found', StatusCodes.NOT_FOUND);

//       res.json({
//         length: addresses?.length,
//         status: 'success',
//         message: 'ok',
//         data: addresses,
//       });
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );

// export const deleteAddresses = catchAsync(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     const { id, addressId } = req.params;
//     ValidateMongoDbId(id);
//     ValidateMongoDbId(addressId);

//     if (!id) throwError('Invalid ID', StatusCodes.BAD_REQUEST);
//     if (!addressId) throwError('No address found', StatusCodes.NOT_FOUND);
//     try {
//       const user = await findUserMId(id);
//       const address = await findUserWithAddressAndDeleteM(addressId);

//       if (!user) throwError('No user found', StatusCodes.NOT_FOUND);

//       if (!address) throwError('No address found', StatusCodes.NOT_FOUND);

//       res.json({
//         status: 'success',
//         message: 'address deleted',
//       });
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );
