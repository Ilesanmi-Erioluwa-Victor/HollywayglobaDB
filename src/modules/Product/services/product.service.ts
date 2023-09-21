import { RequestHandler, NextFunction, Response, Request } from 'express';

import { Utils } from '../../../helper/utils';

import { productQuery } from '../models/product.model';

const { TopCheapProductM, ProductsM } = productQuery;

const { catchAsync } = Utils;

export const TopTenProducts: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const topTenCheapestProducts = await TopCheapProductM();

    res.json({
      length: topTenCheapestProducts.length,
      status: 'success',
      message: 'ok',
      data: topTenCheapestProducts,
    });
  }
);

export const Products: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
