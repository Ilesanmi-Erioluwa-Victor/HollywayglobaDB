import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

import {
  updateCartItemM,
  createCartM,
  createCartItemM,
  getCartM,
  existCartM,
  // updateExistItemCartQuantityM,
  // decreaseCartItemM,
  // increaseCartItemM,
} from '../../User/models/user.cart.model';

const { catchAsync, ValidateMongoDbId } = Utils;

import { throwError } from '../../../middlewares/error';

import { findProductIdM } from '../../Admin/models/admin.product.models';

export const createCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  ValidateMongoDbId(id as string);

  const { productId, quantity } = req.body;

  try {
    if (!id || !productId || !quantity) {
      throwError('Missing required information', StatusCodes.BAD_REQUEST);
      return;
    }

    let cart = await existCartM(id);

    if (!cart) {
      cart = await createCartM(id);
    }

    const existingCartItem = cart.items.find(
      (item) => item.productId === productId
    );
    if (existingCartItem) {
      await updateCartItemM(existingCartItem, quantity);
    } else {
      await createCartItemM(cart, productId, quantity);
    }

    res.json({
      status: 'success',
      message: 'You have successfully added item to Cart',
      data: cart,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const cart = await getCartM(id);

  if (!cart) {
    throwError('No cart found', StatusCodes.NOT_FOUND);
    return;
  }

  res.json({ status: 'success', message: 'ok', data: cart });
};

// export const incrementCartItems = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = req.authId;
//   ValidateMongoDbId(userId as string);

//   const { productId } = req.body;

//   try {
//     if (!productId || !userId)
//       throwError('Invalid params or query', StatusCodes.NOT_FOUND);

//     const existingCartItem = await existItemCartM(userId as string, productId);

//     if (!existingCartItem)
//       throwError('cartItem not found', StatusCodes.NOT_FOUND);

//     const product = await findProductIdM(productId);

//     if (!product) throwError('Product not found', StatusCodes.NOT_FOUND);

//     const price = product?.price || 0;
//     const totalAmount: number | any = existingCartItem?.totalAmount;

//     const newAmount = price + totalAmount;

//     const increaseItem = await increaseCartItemM(
//       existingCartItem?.id as string,
//       userId as string,
//       productId,
//       existingCartItem?.quantity as number,
//       newAmount
//     );

//     res.json({ message: 'Incremented successfully by 1', increaseItem });
//   } catch (error: any) {
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     next(error);
//   }
// };

// export const decreaseCartItems = catchAsync(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     const userId = req.authId;
//     ValidateMongoDbId(userId as string);

//     const { productId } = req.body;

//     try {
//       if (!productId || !userId)
//         throwError('Invalid params or query', StatusCodes.NOT_FOUND);

//       const existingCartItem = await existItemCartM(
//         userId as string,
//         productId
//       );

//       if (!existingCartItem)
//         throwError('cartItem not found', StatusCodes.NOT_FOUND);

//       const product = await findProductIdM(productId);

//       if (!product) throwError('Product not found', StatusCodes.NOT_FOUND);

//       const price = product?.price || 0;
//       const totalAmount: number | any = existingCartItem?.totalAmount;

//       const newAmount = totalAmount - price;

//       if (price <= 0 || totalAmount <= 0) {
//         return throwError(
//           "You can't have negative cart figure, increase your cart items",
//           StatusCodes.FORBIDDEN
//         );
//       }

//       const decreaseItem = await decreaseCartItemM(
//         existingCartItem?.id as string,
//         userId as string,
//         productId,
//         existingCartItem?.quantity as number,
//         newAmount
//       );

//       res.json({ message: 'decrease successfully by 1', decreaseItem });
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );
