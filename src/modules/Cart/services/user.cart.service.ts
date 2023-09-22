import { NextFunction, Response, Request } from 'express';

import { StatusCodes } from 'http-status-codes';

import { Utils } from '../../../helper/utils';

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

import {
  validateProductIdParam,
  validateCreateCategoryInput,
  validateCategoryIdParam,
  validateEditCategoryInput,
  validateUserIdParam,
} from '../../../middlewares/validationMiddlware';

import { BadRequestError, NotFoundError } from '../../../errors/customError';

const { catchAsync } = Utils;

export const createCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId, quantity } = req.body;

  let cart = await existCartM(req.params.id);

  if (!cart) {
    cart = await createCartM(req.params.id);
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
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cart = await getCartM(req.params.id);

  if (cart && cart.items.length > 0) {
    res.json({ status: 'success', message: 'ok', data: cart });
  } else {
    throw new NotFoundError('no cart found ...add product to your cart');
  }
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
