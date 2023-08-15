import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import AppError from '../../../utils';
import { catchAsync, ValidateMongoDbId } from '../../../helper/utils';
import { CustomRequest } from '../../../interfaces/custom';

import { userWishListCartM, existItemCartM } from '../models/user.cart.model';

export const addToWishlist: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.authId;
    ValidateMongoDbId(userId as string);

    const { productId, quantity } = req.body;

    try {
      if (!userId || !productId || !quantity)
        next(
          new AppError('Missing required information', StatusCodes.BAD_REQUEST)
        );

      const existingWishlistItemCart = await existItemCartM(
        userId as string,
        productId
      );

      const userWishlistItem = await userWishListCartM(
        userId as string,
        productId,
        quantity
      );

      res.json({
        message: 'Product added to wishlist',
        data: userWishlistItem,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
