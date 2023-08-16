import { prisma } from '../../../configurations/db';

export const productWishListIdM = async (id: string) => {
  const wishList = await prisma.productWishList.findUnique({
    where: {
      id,
    },
    select: {
      user: true,
      product: true,
      productId: true,
      quantity: true,
      totalAmount: true,
    },
  });
};

export const existItemCartM = async (userId: string, productId: string) => {
  const existItem = await prisma.productWishList.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
    include: {
      product: {
        select: {
          price: true,
          title: true,
          quantity: true,
        },
      },
    },
  });

  return existItem;
};

export const updateExistItemCartQuantityM = async (
  id: string,
  userId: string,
  productId: string,
  totalAmount: number,
  price: number
) => {
  const item = await prisma.productWishList.update({
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
  });

  return item;
};

export const userWishListCartM = async (
  userId: string,
  productId: string,
  quantity: number,
  totalAmount: number
) => {
  const wishList = await prisma.productWishList.create({
    data: {
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
      quantity,
      totalAmount,
    },
    select: {
      id: true,
      quantity: true,
      createdAt: false,
      updatedAt: false,
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

export const increaseCartItem = async (
  id: string,
  userId: string,
  productId: string,
  quantity: number,
  newAmount: number
) => {
  const increaseItem = await prisma.productWishList.update({
    where: {
      id,
      userId,
      productId,
    },
    data: {
      quantity: quantity + 1,
      totalAmount: newAmount,
    },
  });

  return increaseItem;
};
