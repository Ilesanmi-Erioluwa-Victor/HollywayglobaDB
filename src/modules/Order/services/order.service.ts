import { NextFunction, Response, Request } from 'express';

import { ORDER_STATUS } from '@prisma/client';

import { Utils } from '../../../helper/utils';

import { BadRequestError, NotFoundError } from '../../../errors/customError';

import { prisma } from '../../../configurations/db';

import { orderQuery } from '../models/order.model';

const { existCartM, cancelOrderM, updateOrderStatusM } = orderQuery;

const { catchAsync } = Utils;

export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId } = req.body;

      const userCart = await existCartM(cartId, req.user.userId);

      if (!userCart) throw new NotFoundError('no cart fround');

      // Calculate the total amount based on the cart items
      const total_amount = calculateTotalAmount(userCart.items);

      // Create the order in the database
      const order = await prisma.order.create({
        data: {
          userId: req.user.userId,
          shipping_addressId: '64ff37f2c615227f749d7adf',
          shipping_methodId: '650dba5323eaac8a1e9c1a17',
          total_amount,
          payment_methodId: '650dba5323eaac8a1e9c1a17',
          order_items: {
            createMany: {
              data: userCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
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
      console.log(total + item.product.price * item.quantity);
      return total + item.product.price * item.quantity;
    },
    0
  );
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const order = await cancelOrderM(req.params.orderId);

  if (!order) throw new NotFoundError('order not found');

  if (
    order.order_status === ORDER_STATUS.CANCELED ||
    order.order_status === ORDER_STATUS.DELIVERED
  )
    throw new BadRequestError("order can't be cancelled again");

  const updatedOrder = await updateOrderStatusM(req.params.orderId);

  res.json({ message: 'order canceled successfully', order: updatedOrder });
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await prisma.order.findMany({
      where: { userId: req.user.userId },
      orderBy: {
        order_date: 'asc',
      },
    });
    if (order) {
      return res.status(200).send(order);
    }
    res.status(404).send('No orders found');
  } catch (error) {
    res.status(500).send();
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
    });
    if (order) {
      return res.status(200).send(order);
    }
    res.status(404).send('No orders found');
  } catch (error) {
    res.status(500).send();
  }
};
