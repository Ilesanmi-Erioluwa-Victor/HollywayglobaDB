import { RequestHandler, NextFunction, Response, Request } from 'express';

import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

const { catchAsync, ValidateMongoDbId } = Utils;

export const TopTenProducts: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    const topTenCheapestProducts = await prisma.product.findMany({
      take: 10, // Limit to the top ten products
      orderBy: {
        price: 'asc', // Order by price in ascending order (cheapest first)
      },
    });

    res.status(200).json(topTenCheapestProducts);
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
