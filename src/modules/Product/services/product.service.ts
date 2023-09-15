import { RequestHandler, NextFunction, Response, Request } from 'express';

import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { productQueries } from '../models/product.model';

const { TopCheapProduct } = productQueries;

const { catchAsync, ValidateMongoDbId } = Utils;

export const TopTenProducts: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topTenCheapestProducts = await TopCheapProduct();

      res.status(200).json(topTenCheapestProducts);
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
