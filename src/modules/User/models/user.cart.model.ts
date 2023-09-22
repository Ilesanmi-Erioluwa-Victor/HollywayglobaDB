import { prisma } from '../../../configurations/db';

export class cartQuery {
  static async createCartM(userId: string) {
    const cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: { items: { include: { product: true } } },
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
}

export const updateCartItemM = async (
  existingCartItem: { id: string; quantity: number },
  quantity: number
) => {
  const cartItem = await prisma.cartItem.update({
    where: { id: existingCartItem.id },
    data: { quantity: existingCartItem.quantity + quantity },
  });
  return cartItem;
};

export const createCartItemM = async (
  cart: { id: string },
  productId: string,
  quantity: number
) => {
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity: quantity,
    },
  });
  return cartItem;
};
