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

export const addToWishlist: RequestHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.authId;
  ValidateMongoDbId(userId as string);

  const { productId, quantity } = req.body;

  try {
    if (!userId || !productId || !quantity) {
      next(
        new AppError('Missing required information', StatusCodes.BAD_REQUEST)
      );
      return;
    }

    const existingWishlistItemCart = await existItemCartM(userId, productId);

    if (existingWishlistItemCart) {
      const updateWishItemQuantity = await updateExistItemCartQuantityM(
        existingWishlistItemCart?.id,
        userId,
        productId,
        existingWishlistItemCart?.totalAmount,
        existingWishlistItemCart?.product?.price
      );

      res.json({
        message:
          'Product quantity incremented in wishlist, because, product already in cart',
        data: updateWishItemQuantity,
      });
      return;
    }

    const product = await findProductIdM(productId);

    if (!product) {
      next(new AppError('Product not found', StatusCodes.NOT_FOUND));
      return;
    }

    const totalAmount = product.price * quantity;

    const userWishlistItem = await userWishListCartM(
      userId,
      productId,
      quantity,
      totalAmount
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
};

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

    console.log(
      '********* default exiistingCartItem ',
      existingCartItem?.totalAmount,
      existingCartItem?.quantity
    );

    if (!existingCartItem)
      next(new AppError('cartItem not found', StatusCodes.NOT_FOUND));

    const product = await findProductIdM(productId);

    if (!product)
      next(new AppError('Product not found', StatusCodes.NOT_FOUND));

    const price = product?.price || 0;
    const totalAmount: number | any = existingCartItem?.totalAmount;

    console.log(
      '>>>> after increasing increase controller: totalAmount =  ',
      totalAmount,
      existingCartItem?.totalAmount,
      existingCartItem?.quantity
    );
    const newAmount = price + totalAmount;

    const increaseItem = await increaseCartItem(
      existingCartItem?.id as string,
      userId as string,
      productId,
      existingCartItem?.quantity as number,
      newAmount
    );

    res.json({ message: 'Incremented successfully by 1', increaseItem });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
