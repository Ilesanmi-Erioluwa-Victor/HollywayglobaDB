import { prisma } from '../../../configurations/db';

export const existItemCartM = async (userId: string, productId: string) => {
  const existItem = await prisma.productWishList.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
     include: {
      product: true,
    },
  });

  return existItem;
};

export const updateExistItemCartQuantityM = async (
  existingWishlistItemCart: {
    id: string;
    quantity: number;
  },
  quantity: number
) => {
  const cartItem = await prisma.productWishList.update({
    where: { id: existingWishlistItemCart.id },
    data: { quantity: existingWishlistItemCart.quantity + quantity },
    select: {
      id: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
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

  return cartItem;
};

export const userWishListCartM = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const wishList = await prisma.productWishList.create({
    data: {
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
      quantity: quantity,
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
