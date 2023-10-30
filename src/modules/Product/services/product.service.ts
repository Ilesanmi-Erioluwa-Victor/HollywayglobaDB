import { RequestHandler, NextFunction, Response, Request } from 'express';

import { Utils } from '../../../helper/utils';

import { productQuery } from '../models/product.model';
import { NotFoundError } from 'errors/customError';

const { TopCheapProductM, ProductsM, findProductId } = productQuery;

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
    const userProducts = await ProductsM();

    res.json({
      length: userProducts.length,
      status: 'success',
      message: 'ok',
      data: userProducts,
    });
  }
);

export const Product: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await findProductId(req.params.productId);

    if (!product) throw new NotFoundError('No product found, try again');

    res.json({
      status: 'success',
      message: 'ok',
      data: product,
    });
  }
);
