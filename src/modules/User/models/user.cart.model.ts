import { prisma } from '../../../configurations/db';
import {
  ProductWishListResult,
  ProductWishListIncrease,
} from '../user.interface';

// export const productWishListIdM = async (id: string) => {
//   const wishList = await prisma.productWishList.findUnique({
//     where: {
//       id,
//     },
//     select: {
//       user: true,
//       product: true,
//       productId: true,
//       quantity: true,
//       totalAmount: true,
//     },
//   });
// };

export const existCartM = async (userId: string) => {
  const cart = await prisma.cart.findFirst({
    where: {
      userId: userId
    },
    include: { items: { include: { product: true } } },
  });

  return cart;
};

export const userWishListCartM = async (
  userId: string,
  productId: string,
  quantity: number,
  totalAmount: number
) => {
  const wishList = await prisma.cart.create({
    data: {
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
      quantity,
      totalAmount,
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          address: true,
        },
      },
      product: {
        select: {
          title: true,
          price: true,
          colors: true,
          description: true,
          brand: true,
          slug: true,
          images: true,
        },
      },
    },
  });

  return wishList;
};

// TODO a bug to fix in Promise<ProductWishListResult | any> ought to be null
export const updateExistItemCartQuantityM = async (
  id: string,
  userId: string,
  productId: string,
  totalAmount: number,
  price: number
): Promise<ProductWishListResult | any> => {
  const item = await prisma.cart.update({
    where: {
      id,
      userId: userId,
      productId: productId,
    },
    data: {
      quantity: {
        increment: 1,
      },
      totalAmount: totalAmount + price,
    },
    select: {
      id: true,
      quantity: true,
      totalAmount: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          address: true,
        },
      },
      product: {
        select: {
          title: true,
          price: true,
          colors: true,
          description: true,
          brand: true,
          slug: true,
          images: true,
        },
      },
    },
  });

  return item;
};

export const increaseCartItemM = async (
  id: string,
  userId: string,
  productId: string,
  quantity: number,
  newAmount: number
): Promise<ProductWishListIncrease | null> => {
  const increaseItem = await prisma.cart.update({
    where: {
      id,
      userId,
      productId,
    },
    data: {
      quantity: quantity + 1,
      totalAmount: newAmount,
    },
    select: {
      createdAt: false,
      updatedAt: false,
      productId: false,
      userId: false,
      id: true,
      quantity: true,
      totalAmount: true,
    },
  });

  return increaseItem;
};

export const decreaseCartItemM = async (
  id: string,
  userId: string,
  productId: string,
  quantity: number,
  newAmount: number
): Promise<ProductWishListIncrease | null> => {
  const decreaseItem = await prisma.cart.update({
    where: {
      id,
      userId,
      productId,
    },
    data: {
      quantity: quantity - 1,
      totalAmount: newAmount,
    },
    select: {
      createdAt: false,
      updatedAt: false,
      productId: false,
      userId: false,
      id: true,
      quantity: true,
      totalAmount: true,
    },
  });

  return decreaseItem;
};
