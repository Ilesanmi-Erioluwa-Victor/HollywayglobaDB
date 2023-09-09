import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import AppError from '../../../utils';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

import { addressQueries } from '../models/user.address.model';

const { catchAsync, ValidateMongoDbId } = Utils;

const { createAddressM, findUserWithAddressM, updateAddressM } = addressQueries;

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

// TODO a bug to fix here..
export const editAddress: any = catchAsync(
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
