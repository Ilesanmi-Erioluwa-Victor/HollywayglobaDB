import { NextFunction, Response, Request } from 'express';

import { Utils } from '../../../helper/utils';

import { NotFoundError } from '../../../errors/customError';
import { prisma } from '../../../configurations/db';

const { catchAsync } = Utils;

export const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      userId,
      shipping_addressId,
      shipping_methodId,
      payment_methodId,
      orderItems,
    } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        shipping_addressId,
        shipping_methodId,
        payment_methodId,
        total_amount: orderItems.reduce(
          (total: number, orderItem: any) =>
            total + orderItem.quantity * orderItem.price,
          0
        ),
        order_items: orderItems,
      },
    });

    res.json({
      status: 'success',
      message: 'order successfully placed',
      data: order,
    });
  }
);
