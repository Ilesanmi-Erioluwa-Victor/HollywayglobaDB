import { RequestHandler, NextFunction, Response, Request } from 'express';

import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { productQueries } from '../models/product.model';

const { TopCheapProductM, ProductsM } = productQueries;

const { catchAsync, ValidateMongoDbId } = Utils;

export const TopTenProducts: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topTenCheapestProducts = await TopCheapProductM();

      res.status(200).json({
        status: 'success',
        message: 'ok',
        data: topTenCheapestProducts,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const Products: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    ValidateMongoDbId(id);
    if (!id)
      return throwError('You must be logged in', StatusCodes.BAD_REQUEST);
    try {
      const userProducts = await ProductsM();

      res.status(200).json({
        status: 'success',
        message: 'ok',
        data: userProducts,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
