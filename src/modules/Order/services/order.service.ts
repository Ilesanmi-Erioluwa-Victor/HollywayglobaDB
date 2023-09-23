import { NextFunction, Response, Request } from 'express';

import { Utils } from '../../../helper/utils';

import { NotFoundError } from '../../../errors/customError';
import { prisma } from '../../../configurations/db';

const { catchAsync } = Utils;

export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {  cartId } = req.body;

      // Fetch the user's cart with cart items from the database
      const userCart = await prisma.cart.findUnique({
        where: {
          id: cartId,
          userId : req.user.userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!userCart) {
        return res.status(404).json({
          status: 'error',
          message: 'User cart not found',
        });
      }

      // Calculate the total amount based on the cart items
      const total_amount = calculateTotalAmount(userCart.items);

      // Create the order in the database
      const order = await prisma.order.create({
        data: {
          userId: req.user.userId,
          shipping_addressId: '650dba5323eaac8a1e9c1a17', // Replace with the actual shipping address ID
          shipping_methodId: '650dba5323eaac8a1e9c1a17', // Replace with the actual shipping method ID
          total_amount,
          payment_methodId: '650dba5323eaac8a1e9c1a17', // Replace with the actual payment method ID
          order_items: {
            createMany: {
              data: userCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price, // Use the product's price
              })),
            },
          },
        },
      });

      // Clear the user's cart (remove cart items)
      await prisma.cartItem.deleteMany({
        where: {
          cartId,
        },
      });

      res.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        order,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
);

const calculateTotalAmount = (cartItems: any[]) => {
  return cartItems.reduce(
    (total: number, item: { product: { price: number }; quantity: number }) => {
      return total + item.product.price * item.quantity;
    },
    0
  );
};
