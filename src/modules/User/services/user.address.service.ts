import { RequestHandler, NextFunction, Request, Response } from 'express';

import { Utils } from '../../../helper/utils';

import { addressQuery } from '../models/user.address.model';

const { catchAsync } = Utils;

import { userQuery } from '../models/user.model';

import { prisma } from '../../../configurations/db';

import { Forbidden } from '../../../errors/customError';

const { findUserMId } = userQuery;

const {
  createAddressM,
  findAddressesByUserId,
  countUserAddresses,
  updateAddressM,
  findUserWithAddressAndDeleteM,
  findAddressM,
} = addressQuery;

export const createaddress: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

      const addressCount = await countUserAddresses(req.params.id);

      if (addressCount >= 4) 
      throw new Forbidden( 'Maximum number of addresses reached. 4',
      );

      

      const user = await createAddressM(req.body, id);
      res.json({
        status: 'success',
        data: {
          deliveryAddress: user.deliveryAddress,
          additionalInfo: user.additionalInfo,
          region: user.region,
          city: user.city,
          phone: user.phone,
          additionalPhone: user.additionalPhone,
        },
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

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
