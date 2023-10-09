import { categoryI, signupAdmin } from '../interfaces/admin.interface';
import { prisma } from '../../../configurations/db';
import { createProductI, editProductI } from '../interfaces/product.interface';

export const findProductIdM = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      price: true,
      id: true,
      images: true,
      title: true,
      slug: true,
      quantity: true,
    },
  });
  return product;
};

export const createProductM = async (
  productI: createProductI,
  adminId: string,
  categoryId: string,
  data: string[]
) => {
  const { title, slug, description, price, quantity, stock,  } =
    productI;
  const product = await prisma.product.create({
    data: {
      title: title.toLowerCase(),
      slug,
      description,
      price,
      quantity,
      images: data,
      categoryId: '650ca8e29b1a75ef4bcc3667',
      adminId: adminId,
    },
  });
  return product;
};

export const getProductsM = async (
  limit: number,
  startIndex: number,
  where: any
) => {
  const product = await prisma.product.findMany({
    take: limit,
    skip: startIndex,
    orderBy: {
      id: 'desc',
    },
    where,
    select: {
      id: true,
      slug: true,
      description: true,
      price: true,
      title: true,
      quantity: true,
      images: true,
      reviews: {
        select: {
          id: true,
          text: true,
          rating: true,
          user: { select: { firstName: true, lastName: true, id: true } },
          product: {
            select: { title: true, id: true, slug: true, description: true },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          admin: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      CartItem: false,
      OrderItem: false,
      updatedAt: false,
      createdAt: false,
      adminId: false,
      admin: { select: { name: true, email: true, role: true } },
      categoryId: false,
    },
  });
  return product;
};

export const deleteProductM = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  return product;
};

export const editProductM = async (id: string, data: editProductI) => {
  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
    },
  });
  return product;
};

export const editProductImagesM = async (id: string, data: string[]) => {
  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      images: data,
    },
  });
  return product;
};
