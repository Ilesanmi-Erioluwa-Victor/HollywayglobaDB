import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

const { catchAsync, ValidateMongoDbId } = Utils;


export const createAddress: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    ValidateMongoDbId(id);
    if (!id) throwError('Invalid ID', StatusCodes.NOT_FOUND);

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
      const addressCount = await countUserAddresses(id);

      if (addressCount >= 4) {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: 'error',
          message: 'Maximum number of addresses reached.',
        });
      }

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
