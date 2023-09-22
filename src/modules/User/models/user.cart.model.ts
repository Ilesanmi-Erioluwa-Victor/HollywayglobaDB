import { prisma } from '../../../configurations/db';

export class cartQuery {
  static async createCartM(
    userId: string,
    productId: string,
    quantity: number
  ) {
    const cart = await prisma.cart.create({
      data: {
        userId,
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
                title: true,
                price: true,
              },
            },
            quantity: true,
          },
        },
      },
    });

    return cart;
  }

  static async existCartM(userId: string) {
    const cart = await prisma.cart.findFirst({
      where: { userId: userId },
      select: {
        id: true,
        items: {
          select: {
            product: {
              select: {
                title: true,
                price: true,
              },
            },
            quantity: true,
          },
        },
      },
    });

    return cart;
  }

  static async getCartM(userId: string) {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
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

    return cart;
  }

  static async existCartItemM(cartId: string, productId: string) {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });

    return cartItem;
  }

  static async updateCartItemM(
    existingCartItem: { id: string; quantity: number },
    quantity: number
  ) {
    const cartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });
    return cartItem;
  }

  static async createCartItemM(
    cartId: string,
    productId: string,
    quantity: number
  ) {
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
    return cartItem;
  }
}
