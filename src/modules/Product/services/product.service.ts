import { RequestHandler, NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import { CustomRequest } from '../../../interfaces/custom';
import { catchAsync, ValidateMongoDbId } from '../../../helper/utils';
import { createProductM } from '../product.models';
import { findCategoryIdM } from '../../Admin/models';

export const createProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    if (!id)
      next(throwError('Your ID is not valid...', StatusCodes.BAD_REQUEST));
    try {
      const {
        title,
        slug,
        description,
        price,
        quantity,
        // images,
        brand,
        stock,
        colors,
        sold,
          categoryId,
        adminId
      } = req.body;
      const createProduct = await createProductM(req.body);
      console.log(createProduct, createProduct.adminId);
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
