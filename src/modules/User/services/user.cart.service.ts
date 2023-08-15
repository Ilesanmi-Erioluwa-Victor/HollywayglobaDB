import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import AppError from '../../../utils';
import { catchAsync, ValidateMongoDbId } from '../../../helper/utils';
import { CustomRequest } from '../../../interfaces/custom';

import {
  userWishListCartM,
  existItemCartM,
  updateExistItemCartQuantityM,
} from '../models/user.cart.model';

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
      }

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


export const incrementCartItems: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.query.productId as string;
    const userId = req.params.userId as string;

    if (!productId || !userId) {
      return res.status(422).json({ message: 'Invalid params or query id' });
    }

    const existingCartItem = await prisma.productWishList.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (!existingCartItem) {
      return res.status(404).json({ message: 'CartItem not found' });
    }

    const newAmount =
      existingCartItem.product.price + existingCartItem.totalAmount;

    await prisma.productWishList.update({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
      data: {
        productCount: existingCartItem.productCount + 1,
        totalAmount: newAmount,
      },
    });

    res.status(200).json({ message: 'Incremented successfully by 1' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

