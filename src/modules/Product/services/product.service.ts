import { RequestHandler, NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import { CustomRequest } from '../../../interfaces/custom';
import { catchAsync, ValidateMongoDbId } from '../../../helper/utils';
import { createProductM } from '../product.models';

export const createProduct: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authId = req?.authId;
    if (!authId)
      next(
        throwError(
          'You are not authorized to perform this action',
          StatusCodes.FORBIDDEN
        )
      );
    try {
      const {
        title,
        slug,
        description,
        price,
        quantity,
        images,
        brand,
        stock,
        colors,
        sold,
        categoryId,
      } = req.body;
      const createProduct = await createProductM(req.body);
      console.log(createProduct);
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
