import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import AppError from '../../../utils';
import { catchAsync, ValidateMongoDbId } from '../../../helper/utils';
import { CustomRequest } from '../../../interfaces/custom';

import {
  userWishListCartM,
  existItemCartM,
  updateExistItemCartQuantityM,
  increaseCartItem,
} from '../models/user.cart.model';

import { findProductIdM } from '../../Admin/product.models';

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

      if (existingWishlistItemCart) {
        const updateWishItemQuantity = await updateExistItemCartQuantityM(
          existingWishlistItemCart,
          quantity
        );

        const updatedTotalAmount =
          existingWishlistItemCart.product.price *
          updateWishItemQuantity.quantity;

        res.json({
          message:
            'Product quantity incremented in wishlist, because, product already in cart',
          data: {
            ...updateWishItemQuantity,
            totalAmount: updatedTotalAmount,
          },
        });
      } else {
        const userWishlistItem = await userWishListCartM(
          userId as string,
          productId,
          quantity
        );

        const newTotalAmount =
          userWishlistItem.product.price * userWishlistItem.quantity;

        res.json({
          message: 'Product added to wishlist',
          data: {
            ...userWishlistItem,
            totalAmount: newTotalAmount,
          },
        });
      }
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const incrementCartItems: RequestHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.authId;
  ValidateMongoDbId(userId as string);

  const { productId } = req.body;

  try {
    if (!productId || !userId)
      next(new AppError('Invalid params or query', StatusCodes.NOT_FOUND));

    const existingCartItem = await existItemCartM(userId as string, productId);

    if (!existingCartItem)
      next(new AppError('cartItem not found', StatusCodes.NOT_FOUND));

    const product = await findProductIdM(productId);

    if (!product)
      next(new AppError('Product not found', StatusCodes.NOT_FOUND));

    const price = product?.price || 0;
    const id = product?.id;
    const totalAmount = existingCartItem?.totalAmount || 0;

    const newAmount = price + totalAmount;

    const increaseItem = await increaseCartItem(
      existingCartItem?.id as string,
      userId as string,
      productId,
      existingCartItem?.quantity as number,
      newAmount
    );

    res.json({ message: 'Incremented successfully by 1' });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
