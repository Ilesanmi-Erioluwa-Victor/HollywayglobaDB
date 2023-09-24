import { NextFunction, Response, Request } from 'express';

import { Utils } from '../../../helper/utils';

import { cartQuery } from '../models/cart.model';

const {
  existCartM,
  existCartItemM,
  updateCartItemM,
  createCartItemM,
  createCartM,
  getCartM,
  updateDecreaseCartItem,
  DeleteCartItem,
} = cartQuery;

import { NotFoundError } from '../../../errors/customError';

const { catchAsync } = Utils;

export const createCart = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId, quantity } = req.body;

  const existingCart = await existCartM(req.user.userId);

  if (existingCart) {
    const existingCartItem = await existCartItemM(existingCart.id, productId);

    if (existingCartItem) {
      await updateCartItemM(existingCartItem, quantity);

      res.json({
        status: 'success',
        message: 'cart item updated successfully',
        cart: existingCart,
      });
    } else {
      await createCartItemM(existingCart.id, productId, quantity);

      res.json({
        status: 'success',
        message: 'cart item added successfully',
        cart: existingCart,
      });
    }
  } else {
    const newCart = await createCartM(req.user.userId, productId, quantity);
    res.json({
      status: 'success',
      message: 'cart created successfully',
      data: newCart,
    });
  }
});

export const getCart = catchAsync(async (
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
});

export const decreaseCartItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    const userCart = await existCartM(req.user.userId);
    if (!userCart) throw new NotFoundError('no cart found ...');

    const cartItem = await existCartItemM(userCart.id, productId);
    if (!cartItem) throw new NotFoundError('no product found in cart ...');

    if (cartItem.quantity > 1) {
      await updateDecreaseCartItem(cartItem);
    } else {
      await DeleteCartItem(cartItem.id);
    }

    return res.json({
      status: 'success',
      message: 'product quantity decreased',
    });
  }
);

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
