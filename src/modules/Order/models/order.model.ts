import { prisma } from '../../../configurations/db';

import { ORDER_STATUS } from '@prisma/client';

export class orderQuery {
  static async existCartM(cartId: string, userId: string) {
    const userCart = await prisma.cart.findUnique({
      where: {
        id: cartId,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return userCart;
  }

  static async cancelOrderM(orderId: string) {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    return order;
  }

  static async updateOrderStatusM(orderId: string) {
    const order = prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        order_status: ORDER_STATUS.CANCELED,
      },
    });

    return order;
  }

  static async getOrdersM(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: {
        order_date: 'asc',
      },
    });
    return orders;
  }
}
