import { NextFunction, Response, Request } from 'express';

import { StatusCodes } from 'http-status-codes';

import { prisma } from '../../../configurations/db';

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

  const existingCart = await prisma.cart.findFirst({
    where: { userId: req.params.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (existingCart) {
    // Check if the product is already in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: existingCart.id,
        productId,
      },
    });

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Create a new cart item if the product is not in the cart
      await prisma.cartItem.create({
        data: {
          productId,
          cartId: existingCart.id,
          quantity,
        },
      });
    }
  } else {
    // Create a new cart if none exists
    const newCart = await prisma.cart.create({
      data: {
        userId: req.params.id,
        items: {
          create: [
            {
              productId,
              quantity,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });
    res.json({
      status: 'success',
      message: 'you have successfully added item to Cart',
      data: newCart,
    });
  }

  res.json({
    status: 'success',
    message: 'you have successfully updated your Cart',
    data: existingCart,
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
