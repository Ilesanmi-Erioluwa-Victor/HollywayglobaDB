import { prisma } from '../../../configurations/db';

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
}
