import { prisma } from '../../../configurations/db';

export const existItemM = async (userId: string, productId: string) => {
  const existItem = await prisma.productWishList.findFirst({
    where: {
      userId: userId,
      productId: productId,
    },
  });
    
    return existItem
};

export const userWishListM = async (
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
