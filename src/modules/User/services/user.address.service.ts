import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

import { addressQueries } from '../models/user.address.model';

const { catchAsync, ValidateMongoDbId } = Utils;

import { userQueries } from '../../User/models/user.auth.model';

const { findUserMId } = userQueries;

const {
  createAddressM,
  findAddressesByUserId,
  findUserWithAddressM,
  updateAddressM,
  findUserWithAddressAndDeleteM,
  findAddressM,
} = addressQueries;

export const createAddress: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    ValidateMongoDbId(id);
    if (!id) throwError('Invalid ID', StatusCodes.FORBIDDEN);

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

export const editAddress = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id, addressId } = req.params;

    ValidateMongoDbId(id);
    ValidateMongoDbId(addressId);
    if (!id) throwError('Invalid ID', StatusCodes.NOT_FOUND);
    if (!addressId) throwError('No address found', StatusCodes.NOT_FOUND);
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

export const getAddresses = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    ValidateMongoDbId(id);
    if (!id) throwError('Invalid ID', StatusCodes.BAD_REQUEST);
    try {
      const addresses = await findAddressesByUserId(id);
      res.json({
        length: addresses?.length,
        status: 'success',
        message: 'ok',
        data: addresses,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const deleteAddresses = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id, addressId } = req.params;
    ValidateMongoDbId(id);
    if (!id) throwError('Invalid ID', StatusCodes.BAD_REQUEST);
    try {
      const user = await findUserMId(id);
      const address = await findUserWithAddressAndDeleteM(addressId);
      res.json({
        status: 'success',
        message: 'address deleted',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
