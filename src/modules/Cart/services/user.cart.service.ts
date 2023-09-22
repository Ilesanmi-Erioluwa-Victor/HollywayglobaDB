import { NextFunction, Response, Request } from 'express';

import { prisma } from '../../../configurations/db';

import { Utils } from '../../../helper/utils';

import {
  updateCartItemM,
  createCartItemM,
  // getCartM,
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

  const existingCart = await existCartM(req.user.userId);

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

      res.json({
        status: 'success',
        message: 'cart item updated successfully',
        cart: existingCart,
      });
    } else {
      // Create a new cart item if the product is not in the cart
      await prisma.cartItem.create({
        data: {
          productId,
          cartId: existingCart.id,
          quantity,
        },
        include: { product: true },
      });

      res.json({
        status: 'success',
        message: 'cart item added successfully',
        cart: existingCart,
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
        items: {
          select: {
            product: {
              select: {
                title: true, // Select the product title
                price: true, // Select the product price
              },
            },
            quantity: true, // Select the cart item quantity
          },
        },
      },
    });
    res.json({
      status: 'success',
      message: 'cart created successfully',
      data: newCart,
    });
  }
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

export const decreaseCartItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { userId } = req.user; // Assuming you have user information in the request

      // Find the user's cart
      const userCart = await prisma.cart.findFirst({
        where: { userId },
      });

      if (!userCart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Find the cart item for the specified product
      const cartItem = await prisma.cartItem.findFirst({
        where: { cartId: userCart.id, productId },
      });

      if (!cartItem) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Decrease the quantity of the cart item
      if (cartItem.quantity > 1) {
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity - 1 },
        });
      } else {
        // If the quantity is 1 or less, remove the cart item
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      }

      return res.status(200).json({ message: 'Product quantity decreased' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);
